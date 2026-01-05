import {jsonIgnore} from "json-ignore";

export class User {
    id: number;

    username: string;

    name: string;

    email: string;

    @jsonIgnore()
    password: string;

    active: boolean;

    @jsonIgnore()
    createdAt: Date;

    @jsonIgnore()
    updatedAt: Date;

    constructor(id?: number, username?: string, name?: string, email?: string, password?: string, active?: boolean, createdAt?: Date, updatedAt?: Date) {
        if (id) {
            this.id = id;
        } else {
            this.id = 0
        }

        if (username) {
            this.username = username;
        } else {
            this.username = '';
        }

        if (name) {
            this.name = name;
        } else {
            this.name = '';
        }

        if (email) {
            this.email = email;
        } else {
            this.email = '';
        }

        if (password) {
            this.password = password;
        } else {
            this.password = '';
        }

        if (active) {
            this.active = active;
        } else {
            this.active = false;
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