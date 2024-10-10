import { Injectable } from "@nestjs/common";
import { On, Wizard, WizardStep } from "nestjs-telegraf";
import { WizardContext } from "telegraf/typings/scenes";
import { BotService } from "../bot.service";


@Injectable()
@Wizard("buyurtmalar")
export class BuyurtmalarRuyxati{
    constructor(private readonly botService: BotService ){}

    @WizardStep(1)
    async getBuyurtmalar(ctx : WizardContext){
        
        const buyurtmalar = await this.botService.getBuyurtmalar()
        if(buyurtmalar.length == 0){
            ctx.reply("Kechirasiz hozircha buyurtmalar sizda mavjud emas")
            ctx.scene.leave();
            return;
        }
        const textchasi = buyurtmalar.map(buyurtma =>{
            return  (buyurtma.finished? "✅ ":"🚫 ") +  "Id: " + buyurtma.id + ". "+buyurtma.title + "\n\n";
        }).join("")
        await ctx.reply(textchasi)
        await ctx.reply("Buyurtmani id raqamini kiriting.")
        ctx.wizard.next();
    }

    @WizardStep(2)
    @On("text")
    async buyurtmaniTanlash(ctx: WizardContext){
        const id = ctx.text;
        if(Number.isNaN(Number(id))){
            ctx.reply("Hatolik bo'ldi. Boshqatdan boshlang")
            ctx.scene.leave();
            return
        }
        const buyurtma = await this.botService.getOneBuyurtma(Number(id))
        if(buyurtma === null){
            ctx.reply("Kechirasiz ushubu id li buyurtmani topa olmadik")
            return;
        }
        await ctx.reply("Siz tanlagan buyurtmada quyidagi ma'lumotlar jamlangan")
        await ctx.reply(buyurtma.title.toString())
        await ctx.replyWithPhoto(buyurtma.photo.toString())
        await ctx.replyWithVoice(buyurtma.audio.toString())
        ctx.scene.leave(); 
    }
}