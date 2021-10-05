"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUsingAuthChain = exports.VALID_SIGNATURE_TOLERANCE_INTERVAL_MS = void 0;
require("isomorphic-fetch");
const catalystUrl = 'https://peer-lb.decentraland.org/lambdas/crypto/validate-signature';
var AuthLinkType;
(function (AuthLinkType) {
    AuthLinkType["SIGNER"] = "SIGNER";
    AuthLinkType["ECDSA_PERSONAL_EPHEMERAL"] = "ECDSA_EPHEMERAL";
    AuthLinkType["ECDSA_PERSONAL_SIGNED_ENTITY"] = "ECDSA_SIGNED_ENTITY";
    AuthLinkType["ECDSA_EIP_1654_EPHEMERAL"] = "ECDSA_EIP_1654_EPHEMERAL";
    AuthLinkType["ECDSA_EIP_1654_SIGNED_ENTITY"] = "ECDSA_EIP_1654_SIGNED_ENTITY";
})(AuthLinkType || (AuthLinkType = {}));
const AUTH_CHAIN_HEADER_PREFIX = 'x-identity-auth-chain-';
const AUTH_TIMESTAMP_HEADER = 'x-identity-timestamp';
const AUTH_METADATA_HEADER = 'x-identity-metadata';
function buildAuthChain(req) {
    let index = 0;
    const chain = [];
    while (req.headers[AUTH_CHAIN_HEADER_PREFIX + index]) {
        chain.push(JSON.parse(req.headers[AUTH_CHAIN_HEADER_PREFIX + index]));
        index++;
    }
    const timestampString = req.header(AUTH_TIMESTAMP_HEADER);
    const metadata = req.header(AUTH_METADATA_HEADER);
    const timestamp = timestampString ? parseInt(timestampString, 10) : undefined;
    return [chain, timestamp, metadata !== null && metadata !== void 0 ? metadata : ''];
}
// We want all signatures to be "current". We consider "current" to be the current time,
// with a 10 minute tolerance to account for network delays and possibly unsynched clocks
exports.VALID_SIGNATURE_TOLERANCE_INTERVAL_MS = 10 * 1000 * 60;
function validSignatureInterval(timestamp) {
    const currentTime = Date.now();
    return (timestamp > currentTime - exports.VALID_SIGNATURE_TOLERANCE_INTERVAL_MS &&
        timestamp < currentTime + exports.VALID_SIGNATURE_TOLERANCE_INTERVAL_MS);
}
function authenticateUsingAuthChain(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const [chain, timestamp, metadata] = buildAuthChain(req);
        if (chain.length === 0) {
            // Can't authenticate. Invalid authchain
            return false;
        }
        else if (typeof timestamp === 'undefined') {
            // Can't authenticate. Invalid timestamp
            return false;
        }
        else if (!validSignatureInterval(timestamp)) {
            // Can't authenticate. Timestamp too old or too far into the future
            return false;
        }
        else {
            // Validate against Catalyst Server
            const payloadParts = [
                req.method.toLowerCase(),
                req.originalUrl.toLowerCase(),
                timestamp.toString(),
                metadata,
            ];
            const signaturePayload = payloadParts.join(':').toLowerCase();
            const body = JSON.stringify({
                authChain: chain,
                timestamp: signaturePayload,
            }); // we send the endpoint as the timestamp, yes
            const resp = yield fetch(`${catalystUrl}`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            const result = (yield resp.json());
            if (!result.valid) {
                // Can't authenticate. Invalid signature
                return false;
            }
            else {
                req.params.address = chain[0].payload;
                req.params.addressLowercase = chain[0].payload.toLowerCase();
                req.params.authMetadata = metadata;
                return true;
            }
        }
    });
}
exports.authenticateUsingAuthChain = authenticateUsingAuthChain;
//# sourceMappingURL=authenticate.js.map