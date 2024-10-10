import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wizard, WizardStep } from "nestjs-telegraf";
import { BuyurtmaFromUserEntity } from "../entities/buyurtmafromuser";
import { Repository } from "typeorm";
import { WizardContext } from "telegraf/typings/scenes";
import { User } from "../entities/user.entity";
import { buyurtmalarfromUserKeyborad, haYoqKeyboard } from "../helpers/bot_buttons";
import { Buyurtma } from "../entities/buyurtma.entity";

@Injectable()
@Wizard("buyurtmalarimfoydalanuvchilardan")
export class BuyurtmalarFoydalanuvchidan {
    constructor(
        @InjectRepository(BuyurtmaFromUserEntity) private readonly buyurtmafromUserEntity: Repository<BuyurtmaFromUserEntity>,
        @InjectRepository(User) private readonly userEntity: Repository<User>,
        @InjectRepository(Buyurtma) private readonly buyurtmaEntity: Repository<Buyurtma>,

    ) { }
    private buyurtmaFromUser: BuyurtmaFromUserEntity;

    @WizardStep(1)
    async firsFunc(ctx: WizardContext) {
        try {
            const buyurtmalar = await this.buyurtmafromUserEntity.find();
            if (!buyurtmalar || buyurtmalar.length == 0) {
                await ctx.reply("Kechirasiz hozircha foydalanuvchilardan buyurtma kelmadi")
                ctx.scene.leave();
                return;
            }
            
            await ctx.reply(`Sizda jami ${buyurtmalar.length} ta buyurtma mavjud qaysi buyurtmani ko'rmoqchisiz ?`, buyurtmalarfromUserKeyborad(buyurtmalar));
            ctx.wizard.next();
        } catch (e) {
            await ctx.reply("Kechirasiz hatolik vujudga keldi")
            ctx.scene.leave();
            return;
        }
    }

    @WizardStep(2)
    async secondFunc(ctx: any) {
        try {
            const id = Number(ctx.update.callback_query.data);
            if (!id || Number.isNaN(id)) {
                await ctx.reply("Kechirasiz hatolik vujudga keldi")
                ctx.scene.leave();
                return;
            }
            const buyurtma = await this.buyurtmafromUserEntity.findOne({ where: { id } });
            this.buyurtmaFromUser = buyurtma;
            const user = await this.userEntity.findOne({where: {userId: buyurtma.creator}});
            await ctx.replyWithPhoto(buyurtma.photo, { caption: "Buyurtma matni: \n\n" + buyurtma.title })
            await ctx.replyWithVoice(buyurtma.audio, { caption: "Buyurtma berilgan sana: " + buyurtma.created.toString().split("T")[0] + "\nBuyurtmachi telefon raqami: "+user.phone_number})
            await ctx.reply("Siz ushbu buyurtmani qabul qilasizmi ?", haYoqKeyboard())
            ctx.wizard.next();
        } catch (e) {
            await ctx.reply("Kechirasiz hatolik vujudga keldi")
            ctx.scene.leave();
            return;
        }

    }
    @WizardStep(3)
    async theardFunc(ctx:any){
        try {
            const habar =ctx.update.callback_query.data;
            if(habar == "yes"){
                const newbuyurtma = new Buyurtma()
                newbuyurtma.audio = this.buyurtmaFromUser.audio;
                newbuyurtma.photo = this.buyurtmaFromUser.photo;
                newbuyurtma.title = this.buyurtmaFromUser.title;
                await this.buyurtmaEntity.save(newbuyurtma);
                await ctx.reply("Buyurtma qabul qilindi. Uni buyurtmalar bo'limidan ko'rishingiz mumkin")
                ctx.telegram.sendMessage(this.buyurtmaFromUser.creator, "Sizning buyurtmangiz qabul qilindi. \n\nQabul qilingan buyurtma:\n" + this.buyurtmaFromUser.title); 
                await this.buyurtmafromUserEntity.delete(this.buyurtmaFromUser.id);
                ctx.scene.leave();
                return;
            }
            await ctx.reply("Buyurtmani qabul qilmaslik sababini audio formatda qoldiring.")
            ctx.wizard.next()

        } catch (e) {
            await ctx.reply("Kechirasiz hatolik vujudga keldi")
            ctx.scene.leave();
            return;
        }
    }
     
    @WizardStep(4)
    async forthFunc(ctx: any){
        try {
            await ctx.reply("Siz keltirgan sabab mijozga jo'natildi")
            // await ctx.telegram.sendMessage(this.buyurtmaFromUser.creator, "Sizning bu")
            ctx.telegram.sendMessage(this.buyurtmaFromUser.creator, "Sizning buyurtmangiz bekor qilindi. \n\nBekor qilingan buyurtma:\n" + this.buyurtmaFromUser.title); 
            await ctx.telegram.sendVoice(this.buyurtmaFromUser.creator, ctx.message.voice.file_id)
            await this.buyurtmafromUserEntity.delete(this.buyurtmaFromUser.id);
            ctx.scene.leave();
        } catch (e) {
            await ctx.reply("Kechirasiz hatolik vujudga keldi")
            ctx.scene.leave();
            return;
        }
    }

}