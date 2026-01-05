export interface FullUserInfo {
    userInfo: UserInfo;
    userRoles: UserRoles;
}

export interface UserInfo {
    id: number;
    username: string;
    name: string;
    email: string;
    active: boolean;
}

export interface UserRoles {
    admin: boolean;
    teacher: boolean;
    student: boolean;
}