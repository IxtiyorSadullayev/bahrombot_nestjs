import {Context as ContextTelegraf} from 'telegraf'
export interface Context extends ContextTelegraf{
    session: {
        user?: "user" | "admin" | "customer",
        buyurtma?: "bajarildi" | "bekor_qilindi",
        buyurtmaberish?: "matn" | "file"
    }
}