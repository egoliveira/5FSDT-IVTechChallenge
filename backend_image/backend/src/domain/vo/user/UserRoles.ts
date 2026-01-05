import {jsonIgnore} from "json-ignore";

export class UserRoles {
    @jsonIgnore()
    id: number;

    userId: number;

    admin: boolean;

    teacher: boolean;

    student: boolean;

    @jsonIgnore()
    createdAt: Date;

    @jsonIgnore()
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