import {Module} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local'
import { User } from './entities/user.entity';
import { Buyurtma } from './entities/buyurtma.entity';
import { BotUpdate } from './bot.updates';
import { BotService } from './bot.service';
import { BuyurtmaYaratish } from './scenes/buyurtma.scene';
import { BuyurtmalarRuyxati } from './scenes/buyurtmaRuyxat.scene';
import { BuyurtmaniYakunlash } from './scenes/buyurtmaYakunlash';
import { BuyurtmaFromUserEntity } from './entities/buyurtmafromuser';
import { BuyurtmaFromUser } from './scenes/user.buyurtma';
import { BuyurtmalarFoydalanuvchidan } from './scenes/buyurtmafoydalanuvchidan';
import { Mahsulot } from './entities/mahsulot.entity';
import { MahsulotYaratish } from './scenes/mahsulot.scene';
import { ShowMahsulotlar } from './scenes/showMahsulotlar';
const session = new LocalSession({database: 'session_db.json'});
 
@Module({
    imports: [
        TelegrafModule.forRoot({
            token: "7753020608:AAELuFNJPl5vXtnvbx-W1PxppET18313Hog",
            middlewares: [session.middleware()],
        }),
        TypeOrmModule.forFeature([User, Buyurtma, BuyurtmaFromUserEntity, Mahsulot])
    ],
    controllers: [
    ],
    providers: [
        BotUpdate,
        BotService,
        BuyurtmaYaratish,
        BuyurtmalarRuyxati,
        BuyurtmaniYakunlash,
        BuyurtmaFromUser, 
        BuyurtmalarFoydalanuvchidan,
        MahsulotYaratish,
        ShowMahsulotlar
    ]
})
export class BotModule{}
