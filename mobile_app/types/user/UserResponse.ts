export class UserResponse {
    id: number;
    username: string;
    name: string;
    email: string;
    active: boolean;

    constructor(id: number, username: string, name: string, email: string, active: boolean) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.active = active;
    }
}