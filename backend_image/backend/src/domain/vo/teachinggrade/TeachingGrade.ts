import {injectable} from "tsyringe";
import {jsonIgnore} from "json-ignore";
import {TeachingLevel} from "../teachinglevel/TeachingLevel";

@injectable()
export class TeachingGrade {
    id: number;

    teachingLevelId: number;

    teachingLevel: TeachingLevel;

    name: string;

    order: number;

    @jsonIgnore()
    createdAt: Date;

    @jsonIgnore()
    updatedAt: Date;

    constructor(id?: number, teachingLevelId?: number, teachingLevel?: TeachingLevel, name?: string, order?: number,
                createdAt?: Date, updatedAt?: Date) {
        if (id) {
            this.id = id;
        } else {
            this.id = 0
        }

        if (teachingLevelId) {
            this.teachingLevelId = teachingLevelId;
        } else {
            this.teachingLevelId = 0;
        }

        if (teachingLevel) {
            this.teachingLevel = teachingLevel;
        } else {
            this.teachingLevel = new TeachingLevel();
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