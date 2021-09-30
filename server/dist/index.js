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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_PARCEL = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const securityChecks_1 = require("./security/securityChecks");
exports.VALID_PARCEL = [1, 1];
const port = 8080; // default port to listen
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World!');
});
app.get('/check-legit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.headers);
    if (yield (0, securityChecks_1.runChecks)(req, exports.VALID_PARCEL)) {
        console.log('all good');
        return res.status(200).send({ legit: true, msg: 'Your`re OK' });
    }
    else {
        console.log('rejected');
        return res
            .status(400)
            .send({ legit: false, error: 'Can`t validate your request' });
    }
}));
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map