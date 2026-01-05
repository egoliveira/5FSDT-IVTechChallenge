import {Repository} from "typeorm";
import {SubjectEntity} from "../entity/SubjectEntity";

export type SubjectDAO = Repository<SubjectEntity>;
