import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import Campus from "./campus";

@Entity()
export default class Property {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column()
    address: number;

    @ManyToOne(type => Campus, campus => campus.property)
    campus: Campus; 
}