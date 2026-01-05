import {jsonIgnore} from "json-ignore";

export class TeachingLevel {
    id: number;

    name: string;

    order: number;

    @jsonIgnore()
    createdAt: Date;

    @jsonIgnore()
    updatedAt: Date;

    constructor(id?: number, name?: string, order?: number, createdAt?: Date, updatedAt?: Date) {
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

        if (order) {
            this.order = order;
        } else {
            this.order = 0;
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