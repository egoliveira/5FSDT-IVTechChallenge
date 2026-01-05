export class LoginResponse {
    readonly token: string;

    constructor(token: string) {
        this.token = token;
    }
}