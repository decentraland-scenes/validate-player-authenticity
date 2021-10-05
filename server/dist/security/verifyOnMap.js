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
exports.checkArea = exports.checkCoords = exports.checkPlayer = void 0;
const securityChecks_1 = require("./securityChecks");
// validate that the player is active in a catalyst server, and in the indicated coordinates, or within a margin of error
function checkPlayer(playerId, server, parcel) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://' + server + '/comms/peers/';
        // const url = `https://peer.decentraland.org/comms/peers`
        console.log('URL being used: ', url);
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            for (const player of data) {
                if (player.address.toLowerCase() === playerId.toLowerCase()) {
                    console.log('found player');
                    if (checkCoords(player.parcel, parcel)) {
                        return player.parcel;
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
        return false;
    });
}
exports.checkPlayer = checkPlayer;
// check coordinates against a single parcel - within a margin of error
function checkCoords(coords, parcel) {
    if (parcel[0] === coords[0] && parcel[1] === coords[1]) {
        return true;
    }
    if (Math.abs(parcel[0] - coords[0]) <= securityChecks_1.MARGIN_OF_ERROR &&
        Math.abs(parcel[1] - coords[1]) <= securityChecks_1.MARGIN_OF_ERROR) {
        return true;
    }
    else {
        console.log('player in other parcels ', coords, ' should be ', parcel);
        return false;
    }
}
exports.checkCoords = checkCoords;
// check coordinates against a list of valid parcels - within a margin of error
function checkArea(coords, parcels) {
    let match = false;
    for (let i = 0; i < 0; i++) {
        if (checkCoords(coords, parcels[i])) {
            match = true;
        }
    }
    return match;
}
exports.checkArea = checkArea;
//# sourceMappingURL=verifyOnMap.js.map