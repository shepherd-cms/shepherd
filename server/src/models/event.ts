import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import EventTime from "./eventTime";

@Entity()
export default class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany((_type) => EventTime, (eventTime) => eventTime.event)
  eventTimes: EventTime[];
}
