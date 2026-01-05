import {UserRoles} from "../vo/user/UserRoles";

export interface UserRolesRepository {
    getByUserId(userId: number): Promise<UserRoles | undefined>;

    updateByUserId(userId: number, admin: boolean, teacher: boolean, student: boolean): Promise<UserRoles | undefined>;
}