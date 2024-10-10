import { Hears, InjectBot, On, Start, Update } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { Context } from "./context.interface";
import { BotService } from "./bot.service";
import { startButtonforAdmins, startButtonforCustomers, startButtonforUsers, userButtons } from "./helpers/bot_buttons";
import { SceneContext } from "telegraf/typings/scenes";


@Update()
export class BotUpdate {
    constructor(@InjectBot() private readonly bot: Telegraf<Context>, private botService: BotService) { }

    @Start()
    async startCommand(ctx: Context) {
        const id = ctx.message.from.id;
        if(await this.botService.check(id) === null ){
            await ctx.reply("Assalomu aleykum. Ushbu botdan to'liq foydalanish uchun telefon raqamingizni jo'nating. Pastdagi tugmani bosishingiz kifoya", startButtonforUsers())
            ctx.session.user = "user";
        }
        else if ((await this.botService.check(id)).type === "admin"){
            await ctx.reply("Assalomu aleykum Admin. Ish stoliga xush kelibsiz", startButtonforAdmins())
            ctx.session.user = "admin";
        } else if ((await this.botService.check(id)).type === "user"){
            await ctx.reply("Assalomu aleykum Buyurtma dasturiga xush kelibsiz.", userButtons())
            ctx.session.user = "user";
        }
        else {
            await ctx.reply("Assalomu aleykum ishchi. Buyurtmalar sahifasiga xush kelibsiz", startButtonforCustomers())
            ctx.session.user = "customer";
        }

    }
 
    @On("contact")
    async contact (ctx:any){
        const message = ctx.message;
        if(ctx.session.user === "user"){
            let type = "user"
            await this.botService.addToDbUser(message.from.id, message.from.first_name, message.from.last_name, message.from.username, message.contact.phone_number, type)
        
        } else if(ctx.session.user === "admin"){
            let type = "admin"
            await this.botService.addToDbUser(message.from.id, message.from.first_name, message.from.last_name, message.from.username, message.contact.phone_number, type)
        }
        else if(ctx.session.user === "customer"){
            let type = "customer"
            await this.botService.addToDbUser(message.from.id, message.from.first_name, message.from.last_name, message.from.username, message.contact.phone_number, type)
        }
        await ctx.reply("Barchasi joyida", userButtons())
    }

    @Hears("addadmin12345")
    async addAdmin(ctx: Context){ 
        await this.botService.addroleAdmin(ctx.message.from.id);
        await ctx.reply("Tabriklayman siz admin bo'ldingiz /start commandasini bosing va admin bo'lib boshqaring")
    }

    @Hears("addsvarchik12345")
    async addSvarchik(ctx: Context){
        await this.botService.addroleAdmin(ctx.message.from.id);
        await ctx.reply("Tabriklayman siz svarchik bo'ldingiz /start commandasini bosing va admin bo'lib boshqaring")
    }

    @Hears("addkraskachi12345")
    async addkraskachi(ctx: Context){
        await this.botService.addroleAdmin(ctx.message.from.id);
        await ctx.reply("Tabriklayman siz kraskachi bo'ldingiz /start commandasini bosing va admin bo'lib boshqaring")
    }

    // adminlar uchun 

    @Hears("Buyurtma yaratish")
    async buyurtmaYaratish(ctx:SceneContext){
        ctx.scene.enter("buyurtma_yaratish")
    }

    @Hears("Buyurtmalar")
    async buyurtmalar(ctx: SceneContext){
        ctx.scene.enter("buyurtmalar")
    }

    @Hears("Bajarilgan buyurtmalar")
    async bajarilganBuyurtmalar(ctx: Context){
        const buyurtmalar = await this.botService.finishedBuyurtmalar()
        if(buyurtmalar.length == 0){
            await ctx.reply("Kechirasiz hozircha bajarilgan buyurtmalar mavjud emas.")
            return;
        }
        const textchasi = buyurtmalar.map(buyurtma =>{
            return  (buyurtma.finished? "✅ ":"🚫 ") +  "Id: " + buyurtma.id + ". "+buyurtma.title + "\n\n";
        }).join("")
        await ctx.reply(textchasi);
    }

    // yakunlash
    @Hears("yakunlash")
    async buyurtmaniYakunlash(ctx:SceneContext){
        ctx.scene.enter('yakunlash')
    }

    @Hears("Mahsulot yaratish")
    async mahsulotYaratish(ctx: SceneContext){
        ctx.scene.enter('mahsulot');
    }


    // adminlar uchun


    // userlar uchun
    @Hears("Buyurtma berish")
    async postBuyurtma(ctx: SceneContext){
        ctx.scene.enter("buyurtmaFromUser");
    }

    @Hears("Maxsulotlarni ko'rish")
    async showBuyurtmalar(ctx: SceneContext){
        // ctx.scene.reenter
        // ctx.replyWithVoice("", {caption})
        // ctx.telegram.sendMessage()
        console.log("ishladi")
        ctx.scene.enter("showmahsulotlar")
    }

    @Hears("Buyurtmalar foydalanuvchilardan")
    async createBrend(ctx: SceneContext){
        ctx.scene.enter("buyurtmalarimfoydalanuvchilardan")
    }

    // userlar uchun

    // ishchilar uchun 
    @Hears("Buyurtma olish")
    async getBuyurtma(ctx: SceneContext){
        ctx.scene.enter("getbuyurtma")
    }

    @Hears("Buyurtmalarim")
    async getMyBuyurtmalar(ctx: SceneContext){
        
    }
    // ishchilar uchun

}