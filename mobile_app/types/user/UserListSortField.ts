export enum UserListSortField {
    USERNAME = 'username',
    NAME = 'name',
    EMAIL = 'email',
    ACTIVE = 'active'
}

export function stringToUserListSortField(str: string): UserListSortField | undefined {
    let sortField: UserListSortField | undefined = undefined;

    switch (str) {
        case UserListSortField.USERNAME:
            sortField = UserListSortField.USERNAME;
            break;
        case UserListSortField.NAME:
            sortField = UserListSortField.NAME;
            break;
        case UserListSortField.EMAIL:
            sortField = UserListSortField.EMAIL;
            break;
        case UserListSortField.ACTIVE:
            sortField = UserListSortField.ACTIVE;
            break;
        default:
            break;
    }

    return sortField;
}