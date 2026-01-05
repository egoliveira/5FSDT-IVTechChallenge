import {describe} from "node:test";
import {UserMapper} from "../../../src/data/mapper/UserMapper";
import {User} from "../../../src/domain/vo/user/User";
import {UserEntity} from "../../../src/data/entity/UserEntity";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {mock, mockReset} from "jest-mock-extended";
import {TeachingGradeMapper} from "../../../src/data/mapper/TeachingGradeMapper";
import {TeachingLevel} from "../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingGrade} from "../../../src/domain/vo/teachinggrade/TeachingGrade";
import {TeachingLevelEntity} from "../../../src/data/entity/TeachingLevelEntity";
import {TeachingGradeEntity} from "../../../src/data/entity/TeachingGradeEntity";
import {StudentMapper} from "../../../src/data/mapper/StudentMapper";
import {Student} from "../../../src/domain/vo/student/Student";
import {StudentEntity} from "../../../src/data/entity/StudentEntity";

describe('StudentMapper class tests', () => {
    let userMapper: MockProxy<UserMapper>;
    let teachingGradeMapper: MockProxy<TeachingGradeMapper>;

    let mapper: StudentMapper;

    beforeEach(() => {
        userMapper = mock<UserMapper>();
        teachingGradeMapper = mock<TeachingGradeMapper>();

        mapper = new StudentMapper(userMapper, teachingGradeMapper);
    });

    afterEach(() => {
        mockReset(userMapper);
        mockReset(teachingGradeMapper);

        jest.restoreAllMocks();
    })

    test('Should map a student value object to a student entity successfully', () => {
        // Prepare

        const user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const userEntity = new UserEntity(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevelEntity = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGrade = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGradeEntity = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const student = new Student(
            1,
            user.id,
            user,
            teachingGrade.id,
            teachingGrade,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        userMapper.toUserEntity.calledWith(user).mockReturnValue(userEntity);
        teachingGradeMapper.toTeachingGradeEntity.calledWith(teachingGrade).mockReturnValue(teachingGradeEntity);

        // Act

        const result = mapper.toStudentEntity(student);

        // Assert

        expect(result.id).toEqual(student.id);
        expect(result.userId).toEqual(student.userId);
        expect(result.user).toEqual(userEntity);
        expect(result.teachingGradeId).toEqual(student.teachingGradeId);
        expect(result.teachingGrade).toEqual(teachingGradeEntity);
        expect(result.createdAt).toEqual(student.createdAt);
        expect(result.updatedAt).toEqual(student.updatedAt);

        expect(userMapper.toUserEntity).toHaveBeenCalledWith(user);
        expect(teachingGradeMapper.toTeachingGradeEntity).toHaveBeenCalledWith(teachingGrade);
    });

    test('Should map a student entity object to a student value object successfully', () => {
        // Prepare

        const user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const userEntity = new UserEntity(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevelEntity = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGrade = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGradeEntity = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const studentEntity = new StudentEntity(
            1,
            userEntity.id,
            userEntity,
            teachingGradeEntity.id,
            teachingGradeEntity,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        userMapper.fromUserEntity.calledWith(userEntity).mockReturnValue(user);
        teachingGradeMapper.fromTeachingGradeEntity.calledWith(teachingGradeEntity).mockReturnValue(teachingGrade);

        // Act

        const result = mapper.fromStudentEntity(studentEntity);

        // Assert

        expect(result.id).toEqual(studentEntity.id);
        expect(result.userId).toEqual(studentEntity.userId);
        expect(result.user).toEqual(user);
        expect(result.teachingGradeId).toEqual(studentEntity.teachingGradeId);
        expect(result.teachingGrade).toEqual(teachingGrade);
        expect(result.createdAt).toEqual(studentEntity.createdAt);
        expect(result.updatedAt).toEqual(studentEntity.updatedAt);

        expect(userMapper.fromUserEntity).toHaveBeenCalledWith(userEntity);
        expect(teachingGradeMapper.fromTeachingGradeEntity).toHaveBeenCalledWith(teachingGradeEntity);
    });

    test('Should map a list of student entity objects to a list of student value object list successfully', () => {
        // Prepare

        const user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const userEntity = new UserEntity(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevelEntity = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGrade = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGradeEntity = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const studentEntity1 = new StudentEntity(
            1,
            userEntity.id,
            userEntity,
            teachingGradeEntity.id,
            teachingGradeEntity,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const studentEntity2 = new StudentEntity(
            2,
            userEntity.id,
            userEntity,
            teachingGradeEntity.id,
            teachingGradeEntity,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        userMapper.fromUserEntity.calledWith(userEntity).mockReturnValue(user);
        teachingGradeMapper.fromTeachingGradeEntity.calledWith(teachingGradeEntity).mockReturnValue(teachingGrade);

        // Act

        const result = mapper.fromStudentEntities([studentEntity1, studentEntity2]);

        // Assert
        expect(result.length).toEqual(2);

        expect(result[0].id).toEqual(studentEntity1.id);
        expect(result[0].userId).toEqual(studentEntity1.userId);
        expect(result[0].user).toEqual(user);
        expect(result[0].teachingGradeId).toEqual(studentEntity1.teachingGradeId);
        expect(result[0].teachingGrade).toEqual(teachingGrade);
        expect(result[0].createdAt).toEqual(studentEntity1.createdAt);
        expect(result[0].updatedAt).toEqual(studentEntity1.updatedAt);

        expect(result[1].id).toEqual(studentEntity2.id);
        expect(result[1].userId).toEqual(studentEntity2.userId);
        expect(result[1].user).toEqual(user);
        expect(result[1].teachingGradeId).toEqual(studentEntity2.teachingGradeId);
        expect(result[1].teachingGrade).toEqual(teachingGrade);
        expect(result[1].createdAt).toEqual(studentEntity2.createdAt);
        expect(result[1].updatedAt).toEqual(studentEntity2.updatedAt);

        expect(userMapper.fromUserEntity).toHaveBeenNthCalledWith(2, userEntity);
        expect(teachingGradeMapper.fromTeachingGradeEntity).toHaveBeenNthCalledWith(2, teachingGradeEntity);
    });
});