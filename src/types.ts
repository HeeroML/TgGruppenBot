import {Context as GrammyContext, SessionFlavor} from "grammy";
import {I18nContext} from '@grammyjs/i18n'

export interface SessionData {
    lang: string | undefined;
    readonly i18n: I18nContext | undefined;
    url: string, //Defining url as string, used in inline Menu of grammy test bot.
}


export type MyContext = GrammyContext & SessionFlavor<SessionData>;

