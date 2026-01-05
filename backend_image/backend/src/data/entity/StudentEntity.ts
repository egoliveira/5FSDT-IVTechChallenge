import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "./UserEntity";
import {TeachingGradeEntity} from "./TeachingGradeEntity";

@Entity('student')
export class StudentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'user_id',
        nullable: false,
        unique: true,
    })
    userId: number;

    @OneToOne(() => UserEntity, {eager: true})
    @JoinColumn({name: 'user_id'})
    user: UserEntity;

    @Column({
        name: 'teaching_grade_id',
        nullable: true
    })
    teachingGradeId?: number;

    @OneToOne(() => TeachingGradeEntity, {eager: true})
    @JoinColumn({name: 'teaching_grade_id'})
    teachingGrade?: TeachingGradeEntity;

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

    constructor(id?: number, userId?: number, user?: UserEntity, teachingGradeId?: number,
                teachingGrade?: TeachingGradeEntity, createdAt?: Date, updatedAt?: Date) {
        if (id) {
            this.id = id;
        } else {
            this.id = 0
        }

        if (userId) {
            this.userId = userId;
        } else {
            this.userId = 0;
        }

        if (user) {
            this.user = user;
        } else {
            this.user = new UserEntity();
        }

        this.teachingGradeId = teachingGradeId;

        this.teachingGrade = teachingGrade;

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