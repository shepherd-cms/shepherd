import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// import User from "./user";

@Entity()
export default class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  // @ManyToOne(type => User, user => user.roles)
  // user: User;
}
