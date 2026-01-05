import {UserResponse} from "../user/UserResponse";
import {SubjectResponse} from "../subject/SubjectResponse";
import {TeachingGradeResponse} from "../teachinggrade/TeachingGradeResponse";

export class PostResponse {
    readonly id: number;
    readonly title: string;
    readonly content: string;
    readonly userId: number;
    readonly user: UserResponse;
    readonly subjectId: number;
    readonly subject: SubjectResponse;
    readonly teachingGradeId: number;
    readonly teachingGrade: TeachingGradeResponse;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(id: number, title: string, content: string, userId: number, user: UserResponse, subjectId: number, subject: SubjectResponse, teachingGradeId: number, teachingGrade: TeachingGradeResponse, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.user = user;
        this.subjectId = subjectId;
        this.subject = subject;
        this.teachingGradeId = teachingGradeId;
        this.teachingGrade = teachingGrade;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}