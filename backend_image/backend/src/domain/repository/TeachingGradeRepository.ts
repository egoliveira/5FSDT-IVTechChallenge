import {TeachingGrade} from "../vo/teachinggrade/TeachingGrade";

export interface TeachingGradeRepository {
    getByTeachingLevelId(teachingLevelId: number): Promise<TeachingGrade[]>;

    getById(teachingGradeId: number): Promise<TeachingGrade | undefined>;
}