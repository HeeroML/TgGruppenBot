import {I18n, pluralize} from "@grammyjs/i18n";
import dotenv from 'dotenv'; //So that you can use .env file
import path from "path";
dotenv.config();

//Bot Config
//export const URL = process.env.BOT_URL //URL of your application, important for webhooks
//export const PORT = process.env.PORT;  //Port of your webserver, Important for webhooks
export const token: string  = process.env.BOT_TOKEN ?? "Ahm, this can't be not defined. Also i'm not inserting a default token here ;)"; //Token of your bot

//i18n Options
export const i18n = new I18n({
    directory: path.resolve(path.join(__dirname, "../"), "locales"),
    defaultLanguage: "en",
    sessionName: "session",
    useSession: true,
    templateData: {
        pluralize,
        uppercase: (value: string) => value.toUpperCase()
    }
});
