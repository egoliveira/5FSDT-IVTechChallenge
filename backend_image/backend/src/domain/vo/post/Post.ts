import {User} from "../user/User";
import {Subject} from "../subject/Subject";
import {TeachingGrade} from "../teachinggrade/TeachingGrade";

export class Post {
    id: number;

    title: string;

    content: string;

    userId: number;

    user: User;

    subjectId: number;

    subject: Subject;

    teachingGradeId: number;

    teachingGrade: TeachingGrade;

    createdAt: Date;

    updatedAt: Date;

    constructor(id?: number, title?: string, content?: string, userId?: number, user?: User, subjectId?: number,
                subject?: Subject, teachingGradeId?: number, teachingGrade?: TeachingGrade, createdAt?: Date,
                updatedAt?: Date) {
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
            this.user = new User();
        }

        if (subjectId) {
            this.subjectId = subjectId;
        } else {
            this.subjectId = 0;
        }

        if (subject) {
            this.subject = subject;
        } else {
            this.subject = new Subject();
        }

        if (teachingGradeId) {
            this.teachingGradeId = teachingGradeId;
        } else {
            this.teachingGradeId = 0;
        }

        if (teachingGrade) {
            this.teachingGrade = teachingGrade;
        } else {
            this.teachingGrade = new TeachingGrade();
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