import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wizard, WizardStep } from "nestjs-telegraf";
import { Mahsulot } from "../entities/mahsulot.entity";
import { Repository } from "typeorm";
import { WizardContext } from "telegraf/typings/scenes";
import { mahsulotlarInlineKeyboard } from "../helpers/bot_buttons";


@Injectable()
@Wizard("showmahsulotlar")
export class ShowMahsulotlar{

    constructor(@InjectRepository(Mahsulot) private mahsulotRepo: Repository<Mahsulot>){}

    // Mahsulotlarni ro'yxatini chiqarib berish 
    @WizardStep(1)
    async step1(ctx: WizardContext){
        try {
            const mahsulotlar = await this.mahsulotRepo.find();
            if(!mahsulotlar || mahsulotlar.length == 0){
                await ctx.reply("Kechirasiz hozircha mahsulotlar mavjud emas.")
                await ctx.scene.leave();
                return;
            }
            const textmahsulot = mahsulotlar.map(mahsulot =>{
                return "Id: "+mahsulot.id + " \t"+mahsulot.title + "\n\n";
            }).join("")

            await ctx.reply("Mahsulotlar ro'yxati: \n"+ textmahsulot, mahsulotlarInlineKeyboard(mahsulotlar));
             ctx.wizard.next();
        } catch (e) {
            await ctx.reply("Kechirasiz hatolik bo'ldi. Qaytadan urinib ko'ring.")
            await ctx.scene.leave()
            return;
        }
    }

    // Mahsulotni id si orqali chiqarish
    @WizardStep(2)
    async step2(ctx: any){
        try {
            const id = Number(ctx.update.callback_query.data);
            const mahsulot = await this.mahsulotRepo.findOne({where:{id}});
            await ctx.replyWithPhoto(mahsulot.photo, {caption: mahsulot.title});
            await ctx.scene.leave();
        } catch (e) {
            await ctx.reply("Kechirasiz hatolik bo'ldi. Qaytadan urinib ko'ring.")
            await ctx.scene.leave()
            return;
        }
    }

}