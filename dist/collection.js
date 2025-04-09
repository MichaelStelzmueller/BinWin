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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use('/uploads', express_1.default.static(__dirname + '/../uploads'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(__dirname + '/../public'));
app.listen(port, () => {
    console.log('********** Server gestartet **********');
    console.log(`Erreichbar unter https://localhost:${port}`);
});
const ngrok_1 = __importDefault(require("ngrok"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const url = yield ngrok_1.default.connect({
            authtoken: '2d20LomqNfl2H7K6N30s8qeAC0u_6THCufjEsFsgvCWQVdK3t',
            addr: port
        });
        console.log('********** ngrok Tunnel offen **********');
        console.log(url);
        console.log('');
    });
})();
