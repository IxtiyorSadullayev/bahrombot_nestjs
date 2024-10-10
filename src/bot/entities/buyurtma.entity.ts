import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Buyurtma{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: ""})
    title: string;

    @Column({default: ""})
    photo: string;

    @Column({default : ""})
    audio: string;

    @Column({default: null})
    customer: number;

    @Column({default: false})
    finished: boolean;

    @Column({default: 0})
    svarchik: number;

    @Column({default: 0})
    kraskachi: number;

    @UpdateDateColumn()
    updated: Date;

    @CreateDateColumn()
    created: Date;
}