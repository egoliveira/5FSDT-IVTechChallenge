export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC'
}

export function stringToSortOrderField(str: string): SortOrder | undefined {
    let sortOrder: SortOrder | undefined = undefined;

    switch (str) {
        case SortOrder.ASC:
            sortOrder = SortOrder.ASC;
            break;
        case SortOrder.DESC:
            sortOrder = SortOrder.DESC;
            break;
        default:
            break;
    }

    return sortOrder;
}