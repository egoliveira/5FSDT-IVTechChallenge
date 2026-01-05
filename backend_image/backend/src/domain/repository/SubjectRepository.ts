import {Subject} from "../vo/subject/Subject";

export interface SubjectRepository {
    getAll(): Promise<Subject[]>;

    getById(id: number): Promise<Subject | undefined>;
}