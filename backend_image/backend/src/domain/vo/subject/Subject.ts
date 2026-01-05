import {jsonIgnore} from "json-ignore";

export class Subject {
    id: number;

    name: string;

    @jsonIgnore()
    createdAt: Date;

    @jsonIgnore()
    updatedAt: Date;

    constructor(id?: number, name?: string, createdAt?: Date, updatedAt?: Date) {
        if (id) {
            this.id = id;
        } else {
            this.id = 0
        }

        if (name) {
            this.name = name;
        } else {
            this.name = '';
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