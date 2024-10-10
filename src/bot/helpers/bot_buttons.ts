import { Markup } from "telegraf";
import { Buyurtma } from "../entities/buyurtma.entity";
import { BuyurtmaFromUserEntity } from "../entities/buyurtmafromuser";
import { Mahsulot } from "../entities/mahsulot.entity";

export function startButtonforCustomers(){
    return Markup.keyboard([
        Markup.button.callback("Buyurtma olish", "get_work"),
        Markup.button.callback("Buyurtmalarim", "works"),

    ], {
        columns: 2,
    }).resize()
}
export function startButtonforAdmins(){
    return Markup.keyboard([
        Markup.button.callback("Buyurtma yaratish", "get_work"),
        Markup.button.callback("Buyurtmalar", "works"),
        Markup.button.callback("Bajarilgan buyurtmalar", "final_works"),
        Markup.button.callback("Buyurtmalar foydalanuvchilardan", "work_by_users"),
        Markup.button.callback("Mahsulot yaratish", "createmahsulot")
    ], {
        columns: 3,
    }).resize()
}

export function buyurtmalarimforCustomers(){
    return Markup.inlineKeyboard([
        Markup.button.callback('Buyurtma bajarildi', 'Buyurtmani bekor qilish')
    ], {columns: 2})
}

export function startButtonforUsers(){
    return Markup.keyboard([
        Markup.button.contactRequest("Telefon raqamingizni qoldiring")
    ]).resize().oneTime()
}
export function userButtons(){
    return Markup.keyboard([
        Markup.button.callback("Buyurtma berish", "buy_product"),
        Markup.button.callback("Maxsulotlarni ko'rish", "products"),

    ], {
        columns: 2,
    }).resize()
}

export function buyurtmalarInlineKeyborad(buyurtmalar: Buyurtma[] ){
    return Markup.inlineKeyboard([
        buyurtmalar.map((buyurtma) =>{
            return Markup.button.callback(buyurtma.id.toString(), buyurtma.id.toString())
        })
    ], )
}

export function buyurtmalarfromUserKeyborad(buyurtmalar: BuyurtmaFromUserEntity[] ){
    return Markup.inlineKeyboard([
        buyurtmalar.map((buyurtma) =>{
            return Markup.button.callback(buyurtma.id.toString(), buyurtma.id.toString())
        })
    ], )
}
export function mahsulotlarInlineKeyboard(buyurtmalar: Mahsulot[] ){
    return Markup.inlineKeyboard([
        buyurtmalar.map((buyurtma) =>{
            return Markup.button.callback(buyurtma.id.toString(), buyurtma.id.toString())
        })
    ], )
}
export function haYoqKeyboard(){
    return Markup.inlineKeyboard([
        Markup.button.callback("Ha", "yes"),
        Markup.button.callback("Yoq", "no"),
    ])
}