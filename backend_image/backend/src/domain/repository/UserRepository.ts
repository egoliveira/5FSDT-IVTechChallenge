import {User} from "../vo/user/User";
import {UserRoles} from "../vo/user/UserRoles";
import {DataPage} from "../vo/common/DataPage";
import {FindParams} from "../vo/common/FindParams";
import {FindUsersSortField} from "../vo/common/FindUsersSortField";

export interface UserRepository {
    create(user: User, userRoles: UserRoles): Promise<User>;

    getByUsername(username: string): Promise<User | undefined>;

    getById(id: number): Promise<User | undefined>;

    find(username?: string, name?: string, email?: string, active?: boolean, admin?: boolean, teacher?: boolean,
         student?: boolean, findParams?: FindParams<FindUsersSortField>): Promise<DataPage<User>>;

    update(id: number, name?: string, email?: string, active?: boolean): Promise<User | undefined>;

    changePassword(id: number, password: string): Promise<User | undefined>;

    getWithPosts(): Promise<User[]>
}