import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({default: false})
    is_bot: boolean;

    @Column({default: ""})
    first_name: string;

    @Column({default: ""})
    last_name: string;

    @Column({default: ""})
    username: string;

    @Column({default: ""})
    phone_number: string

    @Column({default: "user", enum: ["user", "admin", "customer"]})
    type: string;

    @Column({default: "user",enum: ["svarchik", "kraskachi", "user"]})
    customer: string;

}
