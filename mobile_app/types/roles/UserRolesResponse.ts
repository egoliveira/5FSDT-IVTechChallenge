export class UserRolesResponse {
    readonly userId: number;
    readonly admin: boolean;
    readonly teacher: boolean;
    readonly student: boolean;

    constructor(userId: number, admin: boolean, teacher: boolean, student: boolean) {
        this.userId = userId;
        this.admin = admin;
        this.teacher = teacher;
        this.student = student;
    }
}