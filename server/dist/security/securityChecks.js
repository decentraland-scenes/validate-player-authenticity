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
exports.checkBannedIPs = exports.checkOrigin = exports.runChecks = exports.TESTS_ENABLED = void 0;
const authenticate_1 = require("./authenticate");
const verifyOnMap_1 = require("./verifyOnMap");
exports.TESTS_ENABLED = true;
const blackListedIPS = [
    `14.161.47.252`,
    `170.233.124.66`,
    `2001:818:db0f:7500:3576:469a:760a:8ded`,
    `85.158.181.20`,
    `185.39.220.232`,
    `178.250.10.230`,
    `185.39.220.156`,
];
function runChecks(req, parcel) {
    return __awaiter(this, void 0, void 0, function* () {
        // fetch metadata from auth headers
        const metadata = yield JSON.parse(req.header(`x-identity-metadata`));
        const authchain0 = yield JSON.parse(req.header(`x-identity-auth-chain-0`));
        const coordinates = metadata.parcel.split(',').map((item) => {
            return parseInt(item, 10);
        });
        console.log('FULL METADATA: ', metadata);
        console.log('CATALYST: ', metadata.realm.domain, ' PLAYER ID', authchain0.payload, ' PARCEL', coordinates);
        // check that the request comes from a decentraland domain
        let origin;
        if (exports.TESTS_ENABLED && metadata.realm.catalystName === 'localhost') {
            origin = true;
        }
        else {
            origin = checkOrigin(req);
        }
        // filter against a denylist of malicious ips
        const ipFilter = checkBannedIPs(req);
        // Validate that the authchain signature is real
        const authChain = yield (0, authenticate_1.authenticateUsingAuthChain)(req);
        // validate that the player is in the catalyst & location from the signature
        let catalystPos;
        if (exports.TESTS_ENABLED && metadata.realm.catalystName === 'localhost') {
            catalystPos = true;
        }
        else {
            catalystPos = yield (0, verifyOnMap_1.checkPlayer)(authchain0.payload, metadata.realm.domain, metadata.parcel);
        }
        // validate that the player is in a valid location for this operation - if a parcel is provided
        let validPos;
        if (parcel) {
            validPos = (0, verifyOnMap_1.checkCoords)(coordinates, parcel);
        }
        else {
            validPos = true;
        }
        if (origin && ipFilter && authChain && catalystPos && validPos) {
            return true;
        }
        else {
            return false;
        }
    });
}
exports.runChecks = runChecks;
function checkOrigin(req) {
    if (req.header('origin') !== 'https://play.decentraland.org' &&
        req.header('origin') !== 'https://play.decentraland.zone') {
        return false;
    }
    return true;
}
exports.checkOrigin = checkOrigin;
function checkBannedIPs(req) {
    for (const ip of blackListedIPS) {
        if (req.header('X-Forwarded-For') === ip)
            return false;
    }
    return true;
}
exports.checkBannedIPs = checkBannedIPs;
//# sourceMappingURL=securityChecks.js.map