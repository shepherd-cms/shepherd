import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import User from "./user";

@Entity()
export default class Role {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    // @ManyToOne(type => User, user => user.roles)
    // user: User;
}