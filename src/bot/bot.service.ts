import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Buyurtma } from "./entities/buyurtma.entity";


@Injectable()
export class BotService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>, 
        @InjectRepository(Buyurtma) private readonly buyurtmaRepository: Repository<Buyurtma>
    
    ) { }


    async addToDbUser(userId: number, first_name: string, last_name: string, username: string, phone_number: string, type: string) {
        const condidate = await this.userRepository.findOne({ where: { userId: userId } })
        if (condidate !== null) {
            return null;
        }
        const newUser = this.userRepository.create({ userId, first_name, last_name, username, phone_number, type })
        await this.userRepository.save(newUser);
        return newUser;
    }

    async check(id: number) {
        const condidate = await this.userRepository.findOne({ where: { userId: id } })
        if (!condidate) {
            return null;
        }
        return condidate;
    }

    async addroleAdmin(id: number) {
        const condidate = await this.userRepository.findOne({ where: { userId: id } })
        if (!condidate) {
            return null;
        }
        condidate.type = "admin"
        await this.userRepository.save(condidate);
        return condidate;
    }

    async addroleSvarchik(id:number){
        const coniddate = await this.userRepository.findOne({where: {userId: id}});
        if(!coniddate){
            return null;
        }
        coniddate.customer = "svarchik";
        await this.userRepository.save(coniddate);
        return coniddate;
    }

    async addroleKraskachi(id:number){
        const coniddate = await this.userRepository.findOne({where: {userId: id}});
        if(!coniddate){
            return null;
        }
        coniddate.customer = "kraskachi";
        await this.userRepository.save(coniddate);
        return coniddate;
    }

    async getBuyurtmalar(){
        const buyurtmalar = await this.buyurtmaRepository.find();
        if(!buyurtmalar || buyurtmalar.length===0){
            return []
        }
        return buyurtmalar;
    }

    async getOneBuyurtma(id: number){
        const condidate = await this.buyurtmaRepository.findOne({where: {id}})
        if(!condidate){
            return null;
        }
        return condidate;
    }
    async finishedBuyurtmalar(){
        const buyurtmalar = await this.buyurtmaRepository.find({where:{finished: true}})
        if(!buyurtmalar || buyurtmalar.length==0){
            return []
        }
        return buyurtmalar;
    }
    
}