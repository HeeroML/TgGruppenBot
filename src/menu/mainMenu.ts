import {InlineKeyboard} from "grammy";

export async function mainMenuInlineKeyboard(ctx: any) {
    return new InlineKeyboard()
        .url(ctx.i18n.t('URL'), ctx.session.url).row()
        .text(ctx.i18n.t('optionsMenuButton'), 'optionMenu')
}

export async function backToMain(ctx: any) {
    const menu = await mainMenuInlineKeyboard(ctx)
    ctx.editMessageText(ctx.i18n.t('welcome'), {
        reply_markup: menu
    })
    await ctx.answerCallbackQuery("Home is all you need!");
}