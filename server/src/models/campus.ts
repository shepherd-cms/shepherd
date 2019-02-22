import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import Property from "./property";
import EventTime from './eventTime';

@Entity()
export default class Campus {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name: string;

    @Column()
    address: number;

    @OneToMany(type => Property, property => property.campus)
    property: Property[]; 

    @OneToMany(type => EventTime, eventTime => eventTime.event)
    eventTimes: EventTime[];
}