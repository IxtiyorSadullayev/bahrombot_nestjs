import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wizard, WizardStep } from "nestjs-telegraf";
import { WizardContext } from "telegraf/typings/scenes";
import { Repository } from "typeorm";
import { BuyurtmaFromUserEntity } from "../entities/buyurtmafromuser";
import { haYoqKeyboard, startButtonforUsers, userButtons } from "../helpers/bot_buttons";


@Injectable()
@Wizard("buyurtmaFromUser")
export class BuyurtmaFromUser {
    constructor(@InjectRepository(BuyurtmaFromUserEntity) private readonly buyurtmauserRepository: Repository<BuyurtmaFromUserEntity>) { }

    private title: string;
    private photo: string;
    private audio: string;
    private buyurtmafromuser = new BuyurtmaFromUserEntity();

    @WizardStep(1)
    async getTitle(ctx: WizardContext) {
        await ctx.reply("Qanday maxsulot buyurtma bermoqchisiz ? \n\nMa'lumot kiriting...")
        ctx.wizard.next()
    }

    @WizardStep(2)
    async getPhoto(ctx: WizardContext) {
        try {
            this.title = ctx.text.toString();
            await ctx.reply("Buyurtmaga kerakli bo'lgan rasmni ham joylashtiring.")
            ctx.wizard.next()
        } catch (e) {
            await ctx.reply("Ma'lumotlarni qaytadan kiriting.")

            ctx.scene.leave();
            return;
        }
        // ctx.wizard.back()
    }

    @WizardStep(3)
    async getAudio(ctx: any) {
        try {
            this.photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
            await ctx.reply("Buyurtmaga audio formatda ham ma'lumot bersangiz...")
            ctx.wizard.next()
        } catch (e) {
            await ctx.reply("Ma'lumotlarni qaytadan kiriting.")

            ctx.scene.leave();
            return;
        }
    }

    @WizardStep(4)
    async finishBuyurtma(ctx: any) {
        try {
            this.audio = ctx.message.voice.file_id;
            this.buyurtmafromuser.title = this.title;
            this.buyurtmafromuser.photo = this.photo;
            this.buyurtmafromuser.audio = this.audio;
            this.buyurtmafromuser.creator = ctx.update.message.from.id;
            await ctx.reply("Sizning yuqoridagi ma'lumotlarni to'liqligiga ishonchingiz komilmi", haYoqKeyboard())
            ctx.wizard.next();
        } catch (e) {
            await ctx.reply("Ma'lumotlarni qaytadan kiriting.")

            ctx.scene.leave();
            return;
        }
    }
    @WizardStep(5)
    async hayoqfinish(ctx: any) {
        try {
            const natija = ctx.update.callback_query.data;
            if (natija == 'yes') {
                await this.buyurtmauserRepository.save(this.buyurtmafromuser);
                ctx.reply("Ma'lumotlaringiz saqlandi. Tez orada sizga ma'lum habarni jo'natamiz...", userButtons())
                ctx.scene.leave();
                return;
            }
            await ctx.reply("Ma'lumotlarni qaytadan kiriting.")
            await ctx.deleteMessage();  
            ctx.scene.reenter()
        } catch (e) {
            await ctx.reply("Ma'lumotlarni qaytadan kiriting.")

            ctx.scene.leave();
            return;
        }
    }
}