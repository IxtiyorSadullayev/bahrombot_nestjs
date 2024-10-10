import { Injectable } from "@nestjs/common";
import { On, Wizard, WizardStep } from "nestjs-telegraf";
import { WizardContext } from "telegraf/typings/scenes";
import { InjectRepository } from "@nestjs/typeorm";
import { Buyurtma } from "../entities/buyurtma.entity";
import { Repository } from "typeorm";
import { buyurtmalarInlineKeyborad, haYoqKeyboard } from "../helpers/bot_buttons";


@Injectable()
@Wizard('yakunlash')
export class BuyurtmaniYakunlash{
    constructor(@InjectRepository(Buyurtma) private readonly buyurtmaRepository:Repository<Buyurtma>){}
    private buyurtmaId:number;
    @WizardStep(1)
    async royxatcha(ctx: WizardContext){
        const buyurtmalar = await this.buyurtmaRepository.find({where: {finished:false}});
        const textchasi = buyurtmalar.map(buyurtma =>{
            return  (buyurtma.finished? "✅ ":"🚫 ") +  "Id: " + buyurtma.id + ". "+buyurtma.title + "\n\n";
        }).join("")
        await ctx.reply(textchasi, buyurtmalarInlineKeyborad(buyurtmalar))
        ctx.wizard.next()
    }

    @WizardStep(2)
    @On("callback_query")
    async buyurtmaniYakunlash(ctx: any){
        const id = Number(ctx.update.callback_query.data);
        this.buyurtmaId = id;
        ctx.reply(`Siz ${id} raqamli buyurtmani haqiqatdan ham yakunlamoqchimisiz ?`, haYoqKeyboard())
        ctx.wizard.next();
    }

    @WizardStep(3)
    @On("callback_query")
    async finishBuyurtma(ctx: any){
        const natija = ctx.update.callback_query.data;
        if(natija === "yes"){
            const condidate = await this.buyurtmaRepository.findOne({where: {id: this.buyurtmaId}})
            condidate.finished = true;
            await this.buyurtmaRepository.save(condidate);
            await ctx.reply("Buyurtma bajarildi")
            ctx.scene.leave()
            return;
        }
        await ctx.reply("Buyurtmani bajarish bekor qilindi")
        ctx.scene.leave()
        return;
    }
    
}