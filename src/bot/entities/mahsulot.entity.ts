import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Mahsulot{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    photo: string;

    @UpdateDateColumn()
    updated: Date;

    @CreateDateColumn()
    created: Date;
    
}