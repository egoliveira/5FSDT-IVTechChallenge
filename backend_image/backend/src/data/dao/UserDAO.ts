import {Repository} from "typeorm";
import {UserEntity} from "../entity/UserEntity";

export type UserDAO = Repository<UserEntity>;
