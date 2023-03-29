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
const runDB_1 = require("./database/runDB");
const settings_1 = require("./settings");
const port = process.env.PORT || 3999;
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, runDB_1.runDb)();
    settings_1.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
