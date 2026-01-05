export class ChangePasswordRequest {
    readonly userId: number;
    readonly content: ChangePasswordContent;

    constructor(userId: number, content: ChangePasswordContent) {
        this.userId = userId;
        this.content = content;
    }
}

export class ChangePasswordContent {
    readonly password: string;

    constructor(password: string) {
        this.password = password;
    }
}