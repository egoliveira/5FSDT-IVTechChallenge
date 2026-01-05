import {inject, injectable} from "tsyringe";
import {StudentEntity} from "../entity/StudentEntity";
import {Student} from "../../domain/vo/student/Student";
import {TeachingGrade} from "../../domain/vo/teachinggrade/TeachingGrade";
import {User} from "../../domain/vo/user/User";
import {UserMapper} from "./UserMapper";
import {TeachingGradeMapper} from "./TeachingGradeMapper";
import {UserEntity} from "../entity/UserEntity";
import {TeachingGradeEntity} from "../entity/TeachingGradeEntity";

@injectable()
export class StudentMapper {
    constructor(
        @inject(UserMapper) private readonly userMapper: UserMapper,
        @inject(TeachingGradeMapper) private readonly teachingGradeMapper: TeachingGradeMapper
    ) {
    }

    toStudentEntity(student: Student): StudentEntity {
        let userEntity: UserEntity | undefined = undefined;
        let teachingGradeEntity: TeachingGradeEntity | undefined = undefined;

        if (student.user) {
            userEntity = this.userMapper.toUserEntity(student.user)
        }

        if (student.teachingGrade) {
            teachingGradeEntity = this.teachingGradeMapper.toTeachingGradeEntity(student.teachingGrade);
        }

        return new StudentEntity(
            student.id,
            student.userId,
            userEntity,
            student.teachingGradeId,
            teachingGradeEntity,
            student.createdAt,
            student.updatedAt
        );
    }

    fromStudentEntity(studentEntity: StudentEntity): Student {
        let user: User | undefined = undefined;
        let teachingGrade: TeachingGrade | undefined = undefined;

        if (studentEntity.user) {
            user = this.userMapper.fromUserEntity(studentEntity.user)
        }

        if (studentEntity.teachingGrade) {
            teachingGrade = this.teachingGradeMapper.fromTeachingGradeEntity(studentEntity.teachingGrade);
        }

        return new Student(
            studentEntity.id,
            studentEntity.userId,
            user,
            studentEntity.teachingGradeId,
            teachingGrade,
            studentEntity.createdAt,
            studentEntity.updatedAt
        );
    }

    fromStudentEntities(studentEntities: StudentEntity[]): Student[] {
        return studentEntities.map((studentEntity) => {
            return this.fromStudentEntity(studentEntity);
        });
    }
}