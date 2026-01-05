import {Repository} from "typeorm";
import {PostEntity} from "../entity/PostEntity";

export type PostDAO = Repository<PostEntity>;
