import {Bot, session} from 'grammy'
import {i18n, token} from './config'
import {MyContext, SessionData} from './types';
import {backToMain, mainMenuInlineKeyboard} from './menu/mainMenu';
import {optionsMenu} from "./menu/optionsMenu";

export const bot: any = new Bot<MyContext>(token)
bot.use(
    session({ //Default initializing
        initial(): SessionData {
            return {
                i18n: undefined,
                lang: undefined,
                url: "https://grammy.dev" //Setting default URL
            };
        },
    })
);

bot.use(i18n.middleware()) //Initializing i18n Middleware

//start command
bot.command('start',
    async (ctx) => {
        const mainMenu = await mainMenuInlineKeyboard(ctx) //Passing ctx to the function, so that it can use ctx.
        try {
            await ctx.reply(ctx.i18n.t('welcome'), {
                reply_markup: mainMenu
            })
        } catch (e) {
            console.log("Something stupid happened... " + e)
        }
    }
)

//start command
bot.command('session',
    async (ctx) => {
        const mainMenu = await mainMenuInlineKeyboard(ctx) //Passing ctx to the function, so that it can use ctx.
        try {
            await ctx.reply(ctx.i18n.t('session') + ctx.session, {
                reply_markup: mainMenu
            })
        } catch (e) {
            console.log("Something stupid happened... " + e)
        }
    }
)

//Invest Main Amount
bot.on("message:text", (ctx) => { // with message:text we filter for all messages of type text, no photos and co.
        const text: string = ctx.msg.text;
        ctx.reply("Echo: " + text) //Just echoing every text back
});

bot.callbackQuery("optionMenu", async (ctx) => { //Going into Option Menu
    await optionsMenu(ctx)
});

bot.callbackQuery("backHome", async (ctx) => { //Going back to Home Menu
    await backToMain(ctx) //This function replies the main menu back
});

bot.callbackQuery("setLangDE", async (ctx) => {
    ctx.i18n.locale('de') //We set the language of our bot with i18n.locale(). This is saved in Session
    await backToMain(ctx)
});

bot.callbackQuery("setLangEN", async (ctx) => {
    ctx.i18n.locale('en')
    await backToMain(ctx)
});

bot.on("callback_query:data", async (ctx, next) => { //catching all unknown callback data. This shouldn't happen and is a mistake by you
    console.log("Unknown button event with payload", ctx.callbackQuery.data);
    await ctx.answerCallbackQuery(); // remove loading animation for callbackquerys, Always answer CallbackQuerys
    return next
});

bot.catch(error => {
    console.log('Oh no, we caught a error! ', error)
})



//Startup function
async function startup(): Promise<void> {
    await bot.start()
    console.log(new Date(), 'Bot started as', bot.api.getMe())
}

// Enable graceful stop
startup().then(r => {
    console.log(r)
})
// Enable graceful stop
process.once('SIGINT', () => bot.stop())
process.once('SIGTERM', () => bot.stop())