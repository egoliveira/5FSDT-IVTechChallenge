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
import {SubjectEntity} from "./SubjectEntity";
import {TeachingGradeEntity} from "./TeachingGradeEntity";

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 512,
        nullable: false
    })
    title: string;

    @Column({
        name: 'content',
        nullable: false,
        type: "text"
    })
    content: string;

    @Column({
        name: 'user_id',
        nullable: false,
    })
    userId: number;

    @OneToOne(() => UserEntity, {eager: true})
    @JoinColumn({name: 'user_id'})
    user: UserEntity;

    @Column({
        name: 'subject_id',
        nullable: false,
    })
    subjectId: number;

    @OneToOne(() => SubjectEntity, {eager: true})
    @JoinColumn({name: 'subject_id'})
    subject: SubjectEntity;

    @Column({
        name: 'teaching_grade_id',
        nullable: false
    })
    teachingGradeId: number;

    @OneToOne(() => TeachingGradeEntity, {eager: true})
    @JoinColumn({name: 'teaching_grade_id'})
    teachingGrade: TeachingGradeEntity;

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

    constructor(id?: number, title?: string, content?: string, userId?: number, user?: UserEntity, subjectId?: number,
                subject?: SubjectEntity, teachingGradeId?: number, teachingGrade?: TeachingGradeEntity,
                createdAt?: Date, updatedAt?: Date) {
        if (id) {
            this.id = id;
        } else {
            this.id = 0
        }

        if (title) {
            this.title = title;
        } else {
            this.title = '';
        }

        if (content) {
            this.content = content;
        } else {
            this.content = '';
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

        if (subjectId) {
            this.subjectId = subjectId;
        } else {
            this.subjectId = 0;
        }

        if (subject) {
            this.subject = subject;
        } else {
            this.subject = new SubjectEntity();
        }

        if (teachingGradeId) {
            this.teachingGradeId = teachingGradeId;
        } else {
            this.teachingGradeId = 0;
        }

        if (teachingGrade) {
            this.teachingGrade = teachingGrade;
        } else {
            this.teachingGrade = new TeachingGradeEntity();
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