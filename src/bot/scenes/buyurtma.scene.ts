import { Injectable } from "@nestjs/common";
import {  Ctx, Message, Next, On,  WizardStep, Wizard } from "nestjs-telegraf";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Buyurtma } from "../entities/buyurtma.entity";

@Injectable()
@Wizard('buyurtma_yaratish')
export class BuyurtmaYaratish {
    constructor(@InjectRepository(Buyurtma) private readonly buyurtmaRepository: Repository<Buyurtma>){}

    private title = "";
    private audio = null;
    private photo = null;
    private buyurtma = new Buyurtma()

    @WizardStep(1)
    async getTitle(ctx: any, next: () => ParameterDecorator) {
        await ctx.reply("Buyurtma sarlavhasi qanday ? Uni kiriting...")
        ctx.wizard.next()
    }

    @WizardStep(2)
    @On("text")
    async getPhoto(@Ctx() ctx: any, @Next() next: () => ParameterDecorator) {
        await ctx.reply("Buyurtma haqida rasmni ham qoldiring?")
        this.title = ctx.text;
        this.buyurtma.title=ctx.text;
        ctx.wizard.next()
    }

    @WizardStep(3)
    @On("photo")
    async getAudio(@Ctx() ctx: any, @Message() message: string, @Next() next: () => ParameterDecorator) {
        await ctx.reply("Buyurtma haqida audio habar ham qoldiring?")
        this.photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        this.buyurtma.photo = this.photo;
        ctx.wizard.next()
    }

    @WizardStep(4)
    @On("voice")
    async allData(@Ctx() ctx: any, @Next() next: () => ParameterDecorator) {
        this.audio = ctx.message.voice.file_id;
        this.buyurtma.audio = this.audio;
        await ctx.reply("Barcha ma'lumotlaringiz quyidagicha bo'ldi. Ular bazaga saqlab qo'yildi")
        await ctx.reply("Matni" ,this.title.toString());
        await ctx.replyWithPhoto(this.photo)
        await ctx.replyWithVoice(this.audio)
        await this.buyurtmaRepository.save(this.buyurtma);
        ctx.scene.leave();
    }
}