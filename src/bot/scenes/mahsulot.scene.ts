import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wizard, WizardStep } from "nestjs-telegraf";
import { Mahsulot } from "../entities/mahsulot.entity";
import { Repository } from "typeorm";
import { WizardContext } from "telegraf/typings/scenes";
import { haYoqKeyboard } from "../helpers/bot_buttons";



@Injectable()
@Wizard('mahsulot')
export class MahsulotYaratish {

    constructor(@InjectRepository(Mahsulot) private mahsulotRepo: Repository<Mahsulot>) { }
    private photo: string;
    private title: string;

    // mahsulot haqida tushuntiradi va rasm qabul qilishni tashkillashtiradi
    @WizardStep(1)
    async step1(ctx: any) {
        try {
            // this.photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
            await ctx.reply("Yaratmoqchi bo'lgan mahsulotingizni rasmini tashlang")
            await ctx.wizard.next();
        } catch (e) {
            console.log(e)
            await ctx.reply("Kechirasiz hatolik bo'ldi. Qaytadan urinib ko'ring.")
            await ctx.scene.leave()
            return;
        }
    }

    // mahsulot haqida tushuntiradi va rasm qabul qilishni tashkillashtiradi
    @WizardStep(2)
    async step2(ctx: any) {
        try {
            this.photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
            await ctx.reply("Manashu rasmga mos bo'lgan matnli habar ham kiriting. Bu foydalanuvchilarga ko'rinadi")
            await ctx.wizard.next();
        } catch (e) {
            await ctx.reply("Kechirasiz hatolik bo'ldi. Qaytadan urinib ko'ring.")
            await ctx.scene.leave()
            return;
        }
    }

    // shu rasmga mos bo'lgan matn yaratish
    @WizardStep(3)
    async step3(ctx: WizardContext) {
        try {
            this.title = ctx.text;
            ctx.reply("Ma'lumotlaringiz to'g'riligiga ishonchingiz komilmi ?", haYoqKeyboard());
            await ctx.wizard.next();
        } catch (e) {
            await ctx.reply("Kechirasiz hatolik bo'ldi. Qaytadan urinib ko'ring.")
            await ctx.scene.leave()
            return;
        }
    }

    // Ma'lumotni tekshirish (ha , yo'q)
    @WizardStep(4)
    async step4(ctx: any) {
        try {
            const natija = ctx.update.callback_query.data;
            if (natija == "yes") {
                const newmahsulot = new Mahsulot();
                newmahsulot.title = this.title;
                newmahsulot.photo = this.photo;
                await this.mahsulotRepo.save(newmahsulot);
                await ctx.reply("Mahsulot saqlandi")
                await ctx.scene.leave()
                return;
            }
            await ctx.reply("Mahsulot bekor qilindi.")
            await ctx.scene.leave()
        } catch (e) {
            await ctx.reply("Kechirasiz hatolik bo'ldi. Qaytadan urinib ko'ring.")
            await ctx.scene.leave()
            return;
        }
    }
}