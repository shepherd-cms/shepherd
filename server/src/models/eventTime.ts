import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import Event from './Event';
import Campus from './campus';


@Entity()
export default class EventTime {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    startDate: string;

    @Column()
    endDate: string;

    @Column()
    startTime: string;

    @Column()
    endTime: string;

    @ManyToOne(type => Campus, campus => campus.eventTimes)
    campus: Campus;

    @ManyToOne(type => Event, event => event.eventTimes)
    event: Event;
}