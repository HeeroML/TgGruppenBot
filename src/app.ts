import {Context as TelegrafContext, Markup, Telegraf} from 'telegraf'
import {MenuMiddleware, MenuTemplate} from 'telegraf-inline-menu'
import {telegrafThrottler} from 'telegraf-throttler'
import LocalSession = require('telegraf-session-local');

const promise = require('bluebird'); // or any other Promise/A+ compatible library;

const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};

const pgp = require('pg-promise')(initOptions);
// See also: http://vitaly-t.github.io/pg-promise/module-pg-promise.html

// Database connection details;
const cn = {
    connectionString: process.env.DATABASE_URL,
    max: 20
};
// You can check for all default values in:
// https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/defaults.js

const db = pgp(cn); // database instance;
interface Slanguage {
    test: boolean;
    menu: number;
}

interface MyContext extends TelegrafContext {
    session: Slanguage;
    match: RegExpExecArray | undefined;
}


//Bot Config
const URL = process.env.URL_BOT
const PORT = process.env.PORT
const token = process.env.BOT_TOKEN

// Outgoing Private Throttler
const privateThrottler = telegrafThrottler({
    out: { // TelegramAPI Rate Limit
        minTime: 25,                    // Wait this many milliseconds to be ready, after a job
        reservoir: 30,                  // Number of new jobs that throttler will accept at start
        reservoirRefreshAmount: 30,     // Number of jobs that throttler will accept after refresh
        reservoirRefreshInterval: 1000, // Interval in milliseconds where reservoir will refresh
    },
});
// Outgoing Private Throttler End

// Default Error Handler
const defaultErrorHandler = async (ctx, next, error) => {
    return console.warn(`Inbound ${ctx.from?.id || ctx.chat?.id} | ${error.message}`)
};


//Menu Area Start
//Create SubMenues
const updateMenu = new MenuTemplate<MyContext>(
    'Hier kannst du deine Einträge updaten')
const addMenu = new MenuTemplate<MyContext>(
    'Hier kannst du neue Einträge hinzufügen')
const deleteMenu = new MenuTemplate<MyContext>(
    'Hier kannst du einer deiner Einträge löschen')
const optionsMenu = new MenuTemplate<MyContext>(
    'Hier kannst du Einstellungen ändern')
const testMenu = new MenuTemplate<MyContext>(
    'walletMenu')

//Create SubMenues End

const menu = new MenuTemplate<MyContext>(
    'Willkommen im @gruppen Bot')
//SubMenuItems
menu.submenu(
    'Neuen Eintrag einsetzen', 'addEntryMenu', addMenu, {
        // hide: () => mainMenuToggle
    })
menu.submenu(
    'Eintrag updaten', 'updateEntryMenu', updateMenu, {
        // hide: () => mainMenuToggle
    })
menu.submenu(
    'Eintrag löschen', 'deleteEntryMenu', deleteMenu, {
        joinLastRow: true,
        // hide: () => mainMenuToggle
    })
menu.submenu(
    'Optionen', 'optionsMenu', optionsMenu, {

        // hide: () => mainMenuToggle
    })
//Submenu End

//Add Entry Menu TODO
addMenu.submenu(
    'Neuen Eintrag hinzufügen', 'addEntryButton', testMenu, {})
//Upadte Entry Menu TODO

//Spawning Test Menu
updateMenu.submenu(
    'Eintrag updaten', 'updateEntryMenu', testMenu, {
    })

//Options Menu TODO

optionsMenu.submenu(
    'Test Button', 'testMenu', testMenu, {})
//Wallet Submenu
// @ts-ignore
testMenu.toggle(
    'Test of Toggle Button', 'update afterwards', {
        set: (ctx, newState) => {
            ctx.session.test = newState
            return true
        },
        isSet: ctx => ctx.session.test,
    })


//Main Menu Back Button

updateMenu.navigate(
    'Zurück zum Hauptmenü', '/')
optionsMenu.navigate(
    'Zurück zum Hauptmenü', '/')
deleteMenu.navigate(
    'Zurück zum Hauptmenü', '/')
addMenu.navigate(
    'Zurück zum Hauptmenü', '/')
testMenu.navigate(
    'Zurück zum Hauptmenü', '/', {
        joinLastRow: true
    })
//Menu Area End

//Middleware and bot token

const menuMiddleware = new MenuMiddleware<MyContext>('/', menu)
console.log(menuMiddleware.tree())
// @ts-ignore
const bot = new Telegraf<MyContext>(token)
bot.use(privateThrottler);
bot.use((new LocalSession({database: 'example_db.json'})).middleware())
bot.use(async (ctx, next) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
        console.log('another callbackQuery happened', ctx.callbackQuery.data.length, ctx.callbackQuery.data)
    }

    return next()
})


//start command
bot.command('start',
    async ctx => {
        await menuMiddleware.replyToContext(ctx)
        await (ctx.session.test = false)
    }
)
bot.use(menuMiddleware.middleware())
bot.catch(error => {
    console.log('telegraf error', error)
})

// @ts-ignore
bot.command('/remove', (ctx) => {
    ctx.replyWithMarkdown(`Removing session from database: \`${JSON.stringify(ctx.session)}\``)
    // Setting session to null, undefined or empty object/array will trigger removing it from database
    // @ts-ignore
    ctx.session = null
})
bot.command('/session', (ctx) => {
    ctx.replyWithMarkdown(`Data in Session: \`${JSON.stringify(ctx.session)}\``)
    ctx.reply(':)', Markup.removeKeyboard())
    // Setting session to null, undefined or empty object/array will trigger removing it from database
})

//Startup function
async function startup(): Promise<void> {
    // @ts-ignore
    await bot.launch({
        webhook: {
            domain: URL,
            // @ts-ignore
            port: PORT
        }
    })
    // @ts-ignore
    console.log(new Date(), 'Bot started as', bot.botInfo.username)
}

startup().then(r => {
    console.log(r)
})