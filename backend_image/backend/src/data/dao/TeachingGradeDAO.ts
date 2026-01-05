import {Repository} from "typeorm";
import {TeachingGradeEntity} from "../entity/TeachingGradeEntity";

export type TeachingGradeDAO = Repository<TeachingGradeEntity>;
