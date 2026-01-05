import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {TeachingLevel} from "../../domain/vo/teachinglevel/TeachingLevel";
import {TeachingLevelEntity} from "./TeachingLevelEntity";

@Entity('teaching_grade')
export class TeachingGradeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'teaching_level_id',
        nullable: false
    })
    teachingLevelId: number;

    @OneToOne(() => TeachingLevelEntity, {eager: true})
    @JoinColumn({name: 'teaching_level_id'})
    teachingLevel: TeachingLevelEntity;

    @Column({
        length: 255,
        nullable: false,
        unique: true
    })
    name: string;

    @Column({
        nullable: false
    })
    order: number;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp'
    })
    updatedAt: Date;

    constructor(id?: number, teachingLevelId?: number, teachingLevel?: TeachingLevel, name?: string, order?: number, createdAt?: Date, updatedAt?: Date) {
        if (id) {
            this.id = id;
        } else {
            this.id = 0
        }

        if (teachingLevelId) {
            this.teachingLevelId = teachingLevelId;
        } else {
            this.teachingLevelId = 0;
        }

        if (teachingLevel) {
            this.teachingLevel = teachingLevel;
        } else {
            this.teachingLevel = new TeachingLevel();
        }

        if (name) {
            this.name = name;
        } else {
            this.name = '';
        }

        if (order) {
            this.order = order;
        } else {
            this.order = 0;
        }

        if (createdAt) {
            this.createdAt = createdAt;
        } else {
            this.createdAt = new Date();
        }

        if (updatedAt) {
            this.updatedAt = updatedAt;
        } else {
            this.updatedAt = new Date();
        }
    }
}