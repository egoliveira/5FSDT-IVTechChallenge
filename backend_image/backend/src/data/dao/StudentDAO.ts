import {Repository} from "typeorm";
import {StudentEntity} from "../entity/StudentEntity";

export type StudentDAO = Repository<StudentEntity>;
