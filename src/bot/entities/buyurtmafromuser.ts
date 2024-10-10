import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class BuyurtmaFromUserEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creator: number;

    @Column({default: ""})
    title: string;

    @Column({default: ""})
    photo: string;

    @Column({default : ""})
    audio: string;

    @Column({default: false})
    finished: boolean;

    @Column({default: false})
    qabulQilindi: boolean;

    @UpdateDateColumn()
    updated: Date;

    @CreateDateColumn()
    created: Date;
}