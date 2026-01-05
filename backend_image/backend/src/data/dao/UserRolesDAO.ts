import {Repository} from "typeorm";
import {UserRolesEntity} from "../entity/UserRolesEntity";

export type UserRolesDAO = Repository<UserRolesEntity>;
