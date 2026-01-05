import {TeachingLevelResponse} from "../teachinglevel/TeachingLevelResponse";

export class TeachingGradeResponse {
    readonly id: number;
    readonly name: string;
    readonly order: number;
    readonly teachingLevelId: number;
    readonly teachingLevel: TeachingLevelResponse;

    constructor(id: number, name: string, order: number, teachingLevelId: number, teachingLevel: TeachingLevelResponse) {
        this.id = id;
        this.name = name;
        this.order = order;
        this.teachingLevelId = teachingLevelId;
        this.teachingLevel = teachingLevel;
    }
}