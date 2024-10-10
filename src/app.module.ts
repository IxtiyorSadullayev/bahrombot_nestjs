import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './bot/entities/user.entity';
import { Buyurtma } from './bot/entities/buyurtma.entity';
import { BuyurtmaFromUserEntity } from './bot/entities/buyurtmafromuser';
import { Mahsulot } from './bot/entities/mahsulot.entity';

@Module({
  imports: [
    BotModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "baza.sqlite",
      entities: [User, Buyurtma, BuyurtmaFromUserEntity, Mahsulot],
      synchronize: true,
    }) 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
