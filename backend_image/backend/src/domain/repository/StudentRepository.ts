import {DataPage} from "../vo/common/DataPage";
import {FindParams} from "../vo/common/FindParams";
import {Student} from "../vo/student/Student";
import {FindStudentsSortField} from "../vo/common/FindStudentsSortField";

export interface StudentRepository {
    getById(id: number): Promise<Student | undefined>;

    getByUserId(id: number): Promise<Student | undefined>;

    find(name?: string, email?: string, teachingLevelId?: number, teachingGradeId?: number,
         findParams?: FindParams<FindStudentsSortField>): Promise<DataPage<Student>>;

    update(id: number, teachingGradeId: number): Promise<Student | undefined>;
}