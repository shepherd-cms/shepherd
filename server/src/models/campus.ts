import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Property from "./property";
import EventTime from "./eventTime";

@Entity()
export default class Campus {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  address: number;

  @OneToMany((_type) => Property, (property) => property.campus)
  property: Property[];

  @OneToMany((_type) => EventTime, (eventTime) => eventTime.event)
  eventTimes: EventTime[];
}
