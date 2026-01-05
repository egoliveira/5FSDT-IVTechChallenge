import {UserResponse} from "../user/UserResponse";
import {TeachingGradeResponse} from "../teachinggrade/TeachingGradeResponse";

export class StudentResponse {
    readonly id: number;
    readonly userId: number;
    readonly user: UserResponse;
    readonly teachingGradeId: number | undefined;
    readonly teachingGrade: TeachingGradeResponse | undefined;

    constructor(id: number, userId: number, user: UserResponse, teachingGradeId: number | undefined,
                teachingGrade: TeachingGradeResponse | undefined) {
        this.id = id;
        this.userId = userId;
        this.user = user;
        this.teachingGradeId = teachingGradeId;
        this.teachingGrade = teachingGrade;
    }
}