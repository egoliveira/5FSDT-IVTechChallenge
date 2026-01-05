import {Repository} from "typeorm";
import {TeachingLevelEntity} from "../entity/TeachingLevelEntity";

export type TeachingLevelDAO = Repository<TeachingLevelEntity>;
