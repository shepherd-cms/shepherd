import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import EventTime from "./eventTime";

@Entity()
export default class Event {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @OneToMany((_type) => EventTime, (eventTime) => eventTime.event)
  eventTimes: EventTime[];
}
