import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from "typeorm";
import Role from "./role";

@Entity()
export default class User {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToMany(type => Role)
    @JoinTable()
    roles: Role[];
    // @OneToMany(type => Role, role => role.user)
    // roles: Role[]; 
}