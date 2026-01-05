import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('user_roles')
export class UserRolesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'user_id',
        nullable: false,
        unique: true
    })
    userId: number;

    @Column({
        nullable: false
    })
    admin: boolean;

    @Column({
        nullable: false
    })
    teacher: boolean;

    @Column({
        nullable: false
    })
    student: boolean;

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

    constructor(id?: number, userId?: number, admin?: boolean, teacher?: boolean, student?: boolean, createdAt?: Date, updatedAt?: Date) {
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

        if (admin) {
            this.admin = admin;
        } else {
            this.admin = false;
        }

        if (teacher) {
            this.teacher = teacher;
        } else {
            this.teacher = false;
        }

        if (student) {
            this.student = student;
        } else {
            this.student = false;
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