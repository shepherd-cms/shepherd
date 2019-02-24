import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Event from "./event";
import Campus from "./campus";

@Entity()
export default class EventTime {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne((_type) => Campus, (campus) => campus.eventTimes)
  campus: Campus;

  @ManyToOne((_type) => Event, (event) => event.eventTimes)
  event: Event;
}
