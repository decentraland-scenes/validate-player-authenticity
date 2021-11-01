export const VALID_SIGNATURE_TOLERANCE_INTERVAL_MS = 10 * 1000 * 60

// allow requests from localhost
export const TESTS_ENABLED = false

// number of parcels to use as margin of error when comparing coordinates
export const MARGIN_OF_ERROR = 2

// reject any request from these IPs
export const denyListedIPS = [
  `14.161.47.252`,
  `170.233.124.66`,
  `2001:818:db0f:7500:3576:469a:760a:8ded`,
  `85.158.181.20`,
  `185.39.220.232`,
  `178.250.10.230`,
  `185.39.220.156`,
]

export type Metadata = {
  origin?: string
  sceneId?: string
  parcel?: string
  tld?: string
  network?: string
  isGuest?: boolean
  realm: {
    domain?: string
    catalystName?: string
    layer?: string
    lighthouseVersion?: string
  }
}

export type PeerResponse = {
  ok: boolean
  peers: {
    id: string
    address: string
    lastPing: number
    parcel: [number, number]
    position: [number, number, number]
  }[]
}