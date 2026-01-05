export class UpdateUserRolesRequest {
    readonly userId: number;
    readonly content: UserRolesContent;

    constructor(userId: number, content: UserRolesContent) {
        this.userId = userId;
        this.content = content;
    }
}

export class UserRolesContent {
    readonly admin: boolean;
    readonly teacher: boolean;
    readonly student: boolean;

    constructor(admin: boolean, teacher: boolean, student: boolean) {
        this.admin = admin;
        this.teacher = teacher;
        this.student = student;
    }
}