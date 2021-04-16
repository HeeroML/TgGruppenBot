import { Bot } from 'grammy'
import path from "path";
import {I18n, pluralize} from "grammy-i18n";
import {Context as GrammyContext} from "grammy";
import {I18nContext} from 'grammy-i18n'

export interface Session {
    message_id: number;
    session: any;
}

export interface MyContext extends GrammyContext {
    readonly i18n: I18nContext;
    session: Session;
    match: RegExpExecArray | undefined;
}

//i18n Options
export const i18n = new I18n({
    directory: path.resolve(path.join(__dirname, '../'), 'locales'),
    defaultLanguage: 'en',
    sessionName: 'session',
    useSession: true,
    templateData: {
        pluralize,
        uppercase: (value: string) => value.toUpperCase()
    }
})

const token = process.env.BOT_TOKEN
// Create an instance of the `Bot` class and pass your bot token to it.
// @ts-ignore
const bot =  new Bot<MyContext>(token) // <-- put your bot token between the ''
bot.use(i18n.middleware())

// You can now register listeners for on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// React to /start command
bot.command('start', (ctx) => ctx.reply(ctx.i18n.t('welcome')))
// Handle other messages
bot.on('message', (ctx) => ctx.reply(ctx.i18n.t('message')))

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
bot.catch(e => (console.log(e)))
// Start your bot
bot.start().then(r => console.log(r)).catch(e => console.log(e))