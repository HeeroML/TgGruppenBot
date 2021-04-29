import {I18n, pluralize} from "@grammyjs/i18n";
import dotenv from 'dotenv'; //So that you can use .env file
import path from "path";
dotenv.config();

//Bot Config
//export const URL = process.env.BOT_URL //URL of your application, important for webhooks
//export const PORT = process.env.PORT;  //Port of your webserver, Important for webhooks
export const token: string  = process.env.BOT_TOKEN ?? "Ahm, this can't be not defined. Also i'm not inserting a default token here ;)"; //Token of your bot



//i18n Options
/*
Both .json and .yaml is supported
Example directory structure:
├── locales
│   ├── en.yaml
│   ├── en-US.yaml
│   ├── it.json
│   └── ru.yaml
└── src
    ├── app.ts
*/

export const i18n = new I18n({
    directory: path.resolve(path.join(__dirname, "../"), "locales"),
    defaultLanguage: "en", //The default language used if there is no value supplied to i18n.t()
    useSession: true, //We need this for switching
    templateData: {
        pluralize,
        uppercase: (value: string) => value.toUpperCase()
    }
});
