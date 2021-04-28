import {InlineKeyboard} from "grammy";

async function optionsMenuInlineKeyboard(ctx: any) {
    //Returns true if User Exists

    return new InlineKeyboard()
        .text('English', 'setLangEN').text('German', 'setLangDE').row()
        .text(ctx.i18n.t('backMainMenu'), 'backHome')
}

export async function optionsMenu(ctx: any) {
    const menu = await optionsMenuInlineKeyboard(ctx)
    ctx.editMessageText('Choose your language!', {
        reply_markup: menu
    })
    await ctx.answerCallbackQuery("You were curious, indeed!");
}