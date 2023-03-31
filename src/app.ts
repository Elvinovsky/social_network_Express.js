import { runDb } from "./database/runDB";
import {app, startServer} from "./settings";

const startApp = async () => {

    try {
        await runDb();
        startServer();
    }
    catch {
        console.log("error")
    }
};

startApp()

module.exports = app