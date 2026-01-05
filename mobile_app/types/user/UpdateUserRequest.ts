export class UpdateUserRequest {
    readonly userId: number;
    readonly userContent: UserContent;

    constructor(userId: number, userContent: UserContent) {
        this.userId = userId;
        this.userContent = userContent;
    }
}

export class UserContent {
    readonly name: string | undefined;
    readonly email: string | undefined;
    readonly active: boolean | undefined;

    constructor(name: string | undefined, email: string | undefined, active: boolean | undefined) {
        this.name = name;
        this.email = email;
        this.active = active;
    }
}

