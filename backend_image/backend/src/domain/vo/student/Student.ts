import {User} from "../user/User";
import {TeachingGrade} from "../teachinggrade/TeachingGrade";
import {jsonIgnore} from "json-ignore";

export class Student {
    id: number;

    userId: number;

    user: User;

    teachingGradeId?: number;

    teachingGrade?: TeachingGrade;

    @jsonIgnore()
    createdAt: Date;

    @jsonIgnore()
    updatedAt: Date;

    constructor(id?: number, userId?: number, user?: User, teachingGradeId?: number,
                teachingGrade?: TeachingGrade, createdAt?: Date, updatedAt?: Date) {
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
            this.user = new User();
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