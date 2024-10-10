import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wizard, WizardStep } from "nestjs-telegraf";
import { Buyurtma } from "../entities/buyurtma.entity";
import { Repository } from "typeorm";
import { WizardContext } from "telegraf/typings/scenes";
import { User } from "../entities/user.entity";

@Injectable()
@Wizard("getbuyurtma")
export class GetBuyurtmaCustomer{
    constructor(
        @InjectRepository(Buyurtma) private buyurtmaRepo: Repository<Buyurtma>,
        @InjectRepository(User) private userRepo: Repository<User>
    ){}
//  
// 

    @WizardStep(1)
    async step1(ctx:WizardContext){
        try {
            const id = ctx.message.from.id;
            const user = await this.userRepo.findOne({where: {userId: Number(id)}})
            const buyurtmalar = await this.buyurtmaRepo.find({where: {finished: false}});
            if(user.customer=="svarchik" && buyurtmalar.length>0){
                const buyurtma = buyurtmalar[0]
                await ctx.reply("Sizga ushbu buyurtma berildi")
                await ctx.replyWithPhoto(buyurtma.photo, {caption: buyurtma.title});
                await ctx.replyWithVoice(buyurtma.audio, {caption: buyurtma.created.toString().split("T")[0]})
                buyurtma.customer = user.userId;
                await this.buyurtmaRepo.save(buyurtma);
                ctx.scene.leave();
                return;
            }
            else if(user.customer =="kraskachi" && buyurtmalar.length>0){
                const buyurtma = buyurtmalar[0];
                if(buyurtma.kraskachi !=0){
                    await ctx.reply("Svarchikga ma'lumot jo'natildi. Agarda u ishni bitirgan bo'lsa sizga buyurtmani jo'natadi")
                }
            }
            ctx.reply("Kechirasiz hozircha buyurtmalar mavjud emas.")
            return;
        } catch (e) {
            ctx.reply("Hatolik bo'ldi boshqatdan boshlang.")
            ctx.scene.leave()
            return;
        }
    }
    
}