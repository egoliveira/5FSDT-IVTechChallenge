export class ActiveFlag {
    readonly id: number;
    readonly name: string;
    readonly value: boolean;

    constructor(id: number, name: string, value: boolean) {
        this.id = id;
        this.name = name;
        this.value = value;
    }
}

export const ACTIVE_FLAGS = [
    new ActiveFlag(1, 'Sim', true),
    new ActiveFlag(2, 'Não', false),
];