import { Request } from 'express'
import { recover } from "web3x/utils/index.js"
import 'isomorphic-fetch'

const catalystUrl =
  'https://peer-lb.decentraland.org/lambdas/crypto/validate-signature'

type AuthLink = {
  type: AuthLinkType
  payload: string
  signature: Signature
}

enum AuthLinkType {
  SIGNER = 'SIGNER',
  ECDSA_PERSONAL_EPHEMERAL = 'ECDSA_EPHEMERAL',
  ECDSA_PERSONAL_SIGNED_ENTITY = 'ECDSA_SIGNED_ENTITY',
  ECDSA_EIP_1654_EPHEMERAL = 'ECDSA_EIP_1654_EPHEMERAL',
  ECDSA_EIP_1654_SIGNED_ENTITY = 'ECDSA_EIP_1654_SIGNED_ENTITY',
}

export type Signature = string

const AUTH_CHAIN_HEADER_PREFIX = 'x-identity-auth-chain-'
const AUTH_TIMESTAMP_HEADER = 'x-identity-timestamp'
const AUTH_METADATA_HEADER = 'x-identity-metadata'

function extractIndex(header: string) {
  return parseInt(header.substring(AUTH_CHAIN_HEADER_PREFIX.length), 10)
}

function buildAuthChain(
  req: Request
): [AuthLink[], number | undefined, string] {
  const chain = Object.keys(req.headers)
    .filter((header) => header.includes(AUTH_CHAIN_HEADER_PREFIX))
    .sort((a, b) => (extractIndex(a) > extractIndex(b) ? 1 : -1))
    .map((header) => JSON.parse(req.headers[header] as string) as AuthLink)

  const timestampString = req.header(AUTH_TIMESTAMP_HEADER)
  const metadata = req.header(AUTH_METADATA_HEADER)

  const timestamp = timestampString ? parseInt(timestampString, 10) : undefined
  return [chain, timestamp, metadata ?? '']
}

// We want all signatures to be "current". We consider "current" to be the current time,
// with a 10 minute tolerance to account for network delays and possibly unsynched clocks
export const VALID_SIGNATURE_TOLERANCE_INTERVAL_MS = 10 * 1000 * 60

function validSignatureInterval(timestamp: number) {
  const currentTime = Date.now()
  return (
    timestamp > currentTime - VALID_SIGNATURE_TOLERANCE_INTERVAL_MS &&
    timestamp < currentTime + VALID_SIGNATURE_TOLERANCE_INTERVAL_MS
  )
}

type ValidateSignatureResponse = {
  valid: boolean
  ownerAddress: string
  error?: string
}

export async function authenticateUsingAuthChain(
  req: Request
): Promise<boolean> {
  const [chain, timestamp, metadata] = buildAuthChain(req)

  if (chain.length === 0) {
    // Can't authenticate. Invalid authchain
    return false
  } else if (typeof timestamp === 'undefined') {
    // Can't authenticate. Invalid timestamp
    return false
  } else if (!validSignatureInterval(timestamp)) {
    // Can't authenticate. Timestamp too old or too far into the future
    return false
  } else {
    const user = chain.find((a) => a.type === "SIGNER")
    const ephemeral = chain.find((a) => a.type === "ECDSA_EPHEMERAL")
    const signedEntity = chain.find((a) => a.type === "ECDSA_SIGNED_ENTITY")

    console.log(user);
    console.log(ephemeral);
    console.log(signedEntity);
    

    // If one piece of the chain is missing, fails
    if(!user || !ephemeral || !signedEntity) return false;

    // Recover address from ephemeral signature
    const recoveredUserAddress = recover(ephemeral.payload, ephemeral.signature)
    // Verify that the ephemeral address is the same than the user address
    if(recoveredUserAddress.toString().toLowerCase() !== user.payload.toLowerCase()) return false


    // Recover address from entity signature
    const recoveredEphemeral = recover(signedEntity.payload, signedEntity.signature)
    // Verify that the recovered address is the same than the ephemeral address
    const {ephemeralAddress} = parseEmphemeralPayload(ephemeral.payload)
    console.log(ephemeralAddress);
    
    if(recoveredEphemeral.toString().toLowerCase() !== ephemeralAddress.toLowerCase()) return false
    

    // Everything is ok, the user is the (indirect) signer of the payload
    
    req.params.address = chain[0].payload
    req.params.addressLowercase = chain[0].payload.toLowerCase()
    req.params.authMetadata = metadata
    return true

  }
}

function parseEmphemeralPayload(
  payload: string
): { message: string; ephemeralAddress: string; expiration: number } {
  // authLink payload structure: <human-readable message >\nEphemeral address: <ephemeral-eth - address >\nExpiration: <timestamp>
  // authLink payload example: Decentraland Login\nEphemeral address: 0x123456\nExpiration: 2020 - 01 - 20T22: 57: 11.334Z
  const message = payload.replace(/\r/g, '')
  const payloadParts: string[] = message.split('\n')
  const ephemeralAddress: string = payloadParts[1].substring(
    'Ephemeral address: '.length
  )
  const expirationString: string = payloadParts[2].substring(
    'Expiration: '.length
  )

  const expiration = Date.parse(expirationString)

  return { message, ephemeralAddress, expiration }
}