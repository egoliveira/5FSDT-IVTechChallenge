export class TeachingLevelResponse {
    readonly id: number;
    readonly name: string;
    readonly order: number;


    constructor(id: number, name: string, order: number) {
        this.id = id;
        this.name = name;
        this.order = order;
    }
}