export class DataPage<T> {
    constructor(
        readonly data: T[],
        readonly page: number,
        readonly pageSize: number,
        readonly total: number) {
    }
}