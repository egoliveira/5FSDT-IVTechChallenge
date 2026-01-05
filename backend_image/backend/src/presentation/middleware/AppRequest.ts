import {User} from "../../domain/vo/user/User";
import {Request} from 'express';
import {UserRoles} from "../../domain/vo/user/UserRoles";

export interface AppRequest extends Request {
    user?: User;
    userRoles?: UserRoles;
}