import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Campus from "./campus";

@Entity()
export default class Property {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  address: number;

  @ManyToOne((_type) => Campus, (campus) => campus.property)
  campus: Campus;
}
