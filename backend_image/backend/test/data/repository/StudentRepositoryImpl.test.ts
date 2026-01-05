import {describe} from "node:test";
import {DeepMockProxy, mockDeep, MockProxy} from "jest-mock-extended/lib/Mock";
import {FindManyOptions, FindOneOptions, ILike} from "typeorm";
import {User} from "../../../src/domain/vo/user/User";
import {UserEntity} from "../../../src/data/entity/UserEntity";
import {TeachingLevel} from "../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingLevelEntity} from "../../../src/data/entity/TeachingLevelEntity";
import {TeachingGrade} from "../../../src/domain/vo/teachinggrade/TeachingGrade";
import {TeachingGradeEntity} from "../../../src/data/entity/TeachingGradeEntity";
import {mock, mockReset} from "jest-mock-extended";
import {StudentDAO} from "../../../src/data/dao/StudentDAO";
import {StudentMapper} from "../../../src/data/mapper/StudentMapper";
import {StudentEntity} from "../../../src/data/entity/StudentEntity";
import {StudentRepositoryImpl} from "../../../src/data/repository/StudentRepositoryImpl";
import {SortOrder} from "../../../src/domain/vo/common/SortOrder";
import {FindParams} from "../../../src/domain/vo/common/FindParams";
import {Student} from "../../../src/domain/vo/student/Student";
import {FindStudentsSortField} from "../../../src/domain/vo/common/FindStudentsSortField";
import {PostEntity} from "../../../src/data/entity/PostEntity";

describe('StudentRepositoryImpl class tests', () => {
    let studentDAO: DeepMockProxy<StudentDAO>;
    let studentMapper: MockProxy<StudentMapper>;

    let repository: StudentRepositoryImpl;

    let student1: Student;
    let student1Entity: StudentEntity;
    let student2: Student;
    let student2Entity: StudentEntity;
    let user1: User;
    let user1Entity: UserEntity;
    let user2: User;
    let user2Entity: UserEntity;
    let teachingLevel: TeachingLevel;
    let teachingLevelEntity: TeachingLevelEntity;
    let teachingGrade: TeachingGrade;
    let teachingGradeEntity: TeachingGradeEntity;
    let students: Array<Student>;
    let studentEntities: Array<StudentEntity>;

    beforeEach(() => {
        studentDAO = mockDeep<StudentDAO>();
        studentMapper = mock<StudentMapper>();

        user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        user2 = new User(
            2,
            'user2',
            'User 2',
            'user2@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        user2Entity = new UserEntity(
            2,
            'user2',
            'User 2',
            'user2@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingLevelEntity = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingGrade = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingGradeEntity = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        student1 = new Student(
            1,
            user1.id,
            user1,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        student1Entity = new Student(
            1,
            user1Entity.id,
            user1Entity,
            teachingGradeEntity.id,
            teachingGradeEntity,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        student2 = new Student(
            2,
            user2.id,
            user2,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        student2Entity = new Student(
            2,
            user2Entity.id,
            user2Entity,
            teachingGradeEntity.id,
            teachingGradeEntity,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        students = [student1, student2];

        studentEntities = [student1Entity, student2Entity];

        repository = new StudentRepositoryImpl(studentDAO, studentMapper);
    });

    afterEach(() => {
        mockReset(studentDAO);
        mockReset(studentMapper);

        jest.restoreAllMocks();
    });

    test('Should find students successfully when find method is executed without any parameter', async () => {
        // Arrange

        studentDAO.findAndCount.mockReturnValue(Promise.resolve([studentEntities, studentEntities.length]));

        studentMapper.fromStudentEntities.calledWith(studentEntities).mockReturnValue(students);

        // Act

        const result = await repository.find();

        // Assert

        const expectedFindOptions: FindManyOptions<StudentEntity> = {
            relations: {
                user: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            order: {
                createdAt: SortOrder.DESC
            },
            where: {
                teachingGrade: {},
                user: {
                    active: true
                }
            },
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(students);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(students.length);

        expect(studentDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(studentMapper.fromStudentEntities).toHaveBeenCalledWith(studentEntities);
    });

    test('Should find students successfully when find method is executed with name parameter', async () => {
        // Arrange

        studentDAO.findAndCount.mockReturnValue(Promise.resolve([studentEntities, studentEntities.length]));

        studentMapper.fromStudentEntities.calledWith(studentEntities).mockReturnValue(students);

        // Act

        const result = await repository.find('user');

        // Assert

        const expectedFindOptions: FindManyOptions<StudentEntity> = {
            relations: {
                user: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            order: {
                createdAt: SortOrder.DESC
            },
            where: {
                teachingGrade: {},
                user: {
                    name: ILike('%user%'),
                    active: true
                }
            },
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(students);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(students.length);

        expect(studentDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(studentMapper.fromStudentEntities).toHaveBeenCalledWith(studentEntities);
    });

    test('Should find students successfully when find method is executed with e-mail parameter', async () => {
        // Arrange

        studentDAO.findAndCount.mockReturnValue(Promise.resolve([studentEntities, studentEntities.length]));

        studentMapper.fromStudentEntities.calledWith(studentEntities).mockReturnValue(students);

        // Act

        const result = await repository.find(undefined, 'user');

        // Assert

        const expectedFindOptions: FindManyOptions<StudentEntity> = {
            relations: {
                user: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            order: {
                createdAt: SortOrder.DESC
            },
            where: {
                teachingGrade: {},
                user: {
                    email: ILike('%user%'),
                    active: true
                }
            },
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(students);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(students.length);

        expect(studentDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(studentMapper.fromStudentEntities).toHaveBeenCalledWith(studentEntities);
    });

    test('Should find students successfully when find method is executed with teaching level id parameter', async () => {
        // Arrange

        studentDAO.findAndCount.mockReturnValue(Promise.resolve([studentEntities, studentEntities.length]));

        studentMapper.fromStudentEntities.calledWith(studentEntities).mockReturnValue(students);

        // Act

        const result = await repository.find(undefined, undefined, 1);

        // Assert

        const expectedFindOptions: FindManyOptions<StudentEntity> = {
            relations: {
                user: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            order: {
                createdAt: SortOrder.DESC
            },
            where: {
                teachingGrade: {
                    teachingLevelId: 1
                },
                user: {
                    active: true
                }
            },
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(students);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(students.length);

        expect(studentDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(studentMapper.fromStudentEntities).toHaveBeenCalledWith(studentEntities);
    });

    test('Should find students successfully when find method is executed with teaching grade id parameter', async () => {
        // Arrange

        studentDAO.findAndCount.mockReturnValue(Promise.resolve([studentEntities, studentEntities.length]));

        studentMapper.fromStudentEntities.calledWith(studentEntities).mockReturnValue(students);

        // Act

        const result = await repository.find(undefined, undefined, undefined, 1);

        // Assert

        const expectedFindOptions: FindManyOptions<StudentEntity> = {
            relations: {
                user: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            order: {
                createdAt: SortOrder.DESC
            },
            where: {
                teachingGrade: {},
                teachingGradeId: 1,
                user: {
                    active: true
                }
            },
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(students);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(students.length);

        expect(studentDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(studentMapper.fromStudentEntities).toHaveBeenCalledWith(studentEntities);
    });

    test('Should find students successfully when find method is executed sorting students by name', async () => {
        // Arrange

        studentDAO.findAndCount.mockReturnValue(Promise.resolve([studentEntities, studentEntities.length]));

        studentMapper.fromStudentEntities.calledWith(studentEntities).mockReturnValue(students);

        // Act

        const findParams = new FindParams<FindStudentsSortField>(
            FindStudentsSortField.NAME,
            SortOrder.DESC,
            0,
            5
        );

        const result = await repository.find(undefined, undefined, undefined, undefined, findParams);

        // Assert

        const expectedFindOptions: FindManyOptions<StudentEntity> = {
            relations: {
                user: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            order: {
                user: {
                    name: SortOrder.DESC
                },
                createdAt: SortOrder.DESC
            },
            where: {
                teachingGrade: {},
                user: {
                    active: true
                }
            },
            take: 5,
            skip: 0
        }

        expect(result.data).toEqual(students);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(5);
        expect(result.total).toEqual(students.length);

        expect(studentDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(studentMapper.fromStudentEntities).toHaveBeenCalledWith(studentEntities);
    });

    test('Should find students successfully when find method is executed sorting students by e-mail', async () => {
        // Arrange

        studentDAO.findAndCount.mockReturnValue(Promise.resolve([studentEntities, studentEntities.length]));

        studentMapper.fromStudentEntities.calledWith(studentEntities).mockReturnValue(students);

        // Act

        const findParams = new FindParams<FindStudentsSortField>(
            FindStudentsSortField.EMAIL,
            SortOrder.DESC,
            0,
            5
        );

        const result = await repository.find(undefined, undefined, undefined, undefined, findParams);

        // Assert

        const expectedFindOptions: FindManyOptions<StudentEntity> = {
            relations: {
                user: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            order: {
                user: {
                    email: SortOrder.DESC
                },
                createdAt: SortOrder.DESC
            },
            where: {
                teachingGrade: {},
                user: {
                    active: true
                }
            },
            take: 5,
            skip: 0
        }

        expect(result.data).toEqual(students);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(5);
        expect(result.total).toEqual(students.length);

        expect(studentDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(studentMapper.fromStudentEntities).toHaveBeenCalledWith(studentEntities);
    });

    test('Should find students successfully when find method is executed sorting students by teaching level', async () => {
        // Arrange

        studentDAO.findAndCount.mockReturnValue(Promise.resolve([studentEntities, studentEntities.length]));

        studentMapper.fromStudentEntities.calledWith(studentEntities).mockReturnValue(students);

        // Act

        const findParams = new FindParams<FindStudentsSortField>(
            FindStudentsSortField.TEACHING_LEVEL,
            SortOrder.DESC,
            0,
            5
        );

        const result = await repository.find(undefined, undefined, undefined, undefined, findParams);

        // Assert

        const expectedFindOptions: FindManyOptions<StudentEntity> = {
            relations: {
                user: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            order: {
                teachingGrade: {
                    teachingLevel: {
                        order: SortOrder.DESC
                    },
                },
                createdAt: SortOrder.DESC
            },
            where: {
                teachingGrade: {},
                user: {
                    active: true
                }
            },
            take: 5,
            skip: 0
        }

        expect(result.data).toEqual(students);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(5);
        expect(result.total).toEqual(students.length);

        expect(studentDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(studentMapper.fromStudentEntities).toHaveBeenCalledWith(studentEntities);
    });

    test('Should find students successfully when find method is executed sorting students by teaching grade', async () => {
        // Arrange

        studentDAO.findAndCount.mockReturnValue(Promise.resolve([studentEntities, studentEntities.length]));

        studentMapper.fromStudentEntities.calledWith(studentEntities).mockReturnValue(students);

        // Act

        const findParams = new FindParams<FindStudentsSortField>(
            FindStudentsSortField.TEACHING_GRADE,
            SortOrder.DESC,
            0,
            5
        );

        const result = await repository.find(undefined, undefined, undefined, undefined, findParams);

        // Assert

        const expectedFindOptions: FindManyOptions<StudentEntity> = {
            relations: {
                user: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            order: {
                teachingGrade: {
                    order: SortOrder.DESC
                },
                createdAt: SortOrder.DESC
            },
            where: {
                teachingGrade: {},
                user: {
                    active: true
                }
            },
            take: 5,
            skip: 0
        }

        expect(result.data).toEqual(students);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(5);
        expect(result.total).toEqual(students.length);

        expect(studentDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(studentMapper.fromStudentEntities).toHaveBeenCalledWith(studentEntities);
    });

    test('Should retrieve a student by its id successfully when getById method is executed', async () => {
        // Arrange

        studentDAO.findOne.mockReturnValue(Promise.resolve(student1Entity));

        studentMapper.fromStudentEntity.calledWith(student1Entity).mockReturnValue(student1);

        // Act

        const result = await repository.getById(1);

        // Assert

        expect(result).toEqual(student1);

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1,
                user: {
                    active: true
                }
            }
        }

        expect(studentDAO.findOne).toHaveBeenCalledWith(options);
        expect(studentMapper.fromStudentEntity).toHaveBeenCalledWith(student1Entity);
    });

    test('Should not retrieve a student by its id successfully due to invalid student id when getById method is executed', async () => {
        // Arrange

        studentDAO.findOne.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.getById(1);

        // Assert

        expect(result).toBeUndefined();

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1,
                user: {
                    active: true
                }
            }
        }

        expect(studentDAO.findOne).toHaveBeenCalledWith(options);
    });

    test('Should retrieve a student by its user id successfully when getByUserId method is executed', async () => {
        // Arrange

        studentDAO.findOne.mockReturnValue(Promise.resolve(student1Entity));

        studentMapper.fromStudentEntity.calledWith(student1Entity).mockReturnValue(student1);

        // Act

        const result = await repository.getByUserId(1);

        // Assert

        expect(result).toEqual(student1);

        const options: FindOneOptions<PostEntity> = {
            where: {
                user: {
                    id: 1,
                    active: true
                }
            }
        }

        expect(studentDAO.findOne).toHaveBeenCalledWith(options);
        expect(studentMapper.fromStudentEntity).toHaveBeenCalledWith(student1Entity);
    });

    test('Should not retrieve a student by its user id successfully due to invalid user id when getByUserId method is executed', async () => {
        // Arrange

        studentDAO.findOne.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.getByUserId(1);

        // Assert

        expect(result).toBeUndefined();

        const options: FindOneOptions<PostEntity> = {
            where: {
                user: {
                    id: 1,
                    active: true
                }
            }
        }

        expect(studentDAO.findOne).toHaveBeenCalledWith(options);
    });

    test('Should update a student successfully when update method is executed with teaching grade parameter', async () => {
        // Arrange

        const changedStudentEntity = structuredClone(student1Entity);
        const updatedStudentEntity = structuredClone(student1Entity);
        const updatedStudent = structuredClone(student1);

        changedStudentEntity.teachingGradeId = 2;
        updatedStudentEntity.teachingGradeId = 2;
        updatedStudent.teachingGradeId = 2;

        studentDAO.findOne.mockReturnValue(Promise.resolve(student1Entity))
            .mockReturnValue(Promise.resolve(updatedStudentEntity));

        studentDAO.save.mockReturnValue(Promise.resolve(updatedStudentEntity));

        studentMapper.fromStudentEntity.calledWith(updatedStudentEntity).mockReturnValue(updatedStudent);

        // Act

        const result = await repository.update(1, 2);

        // Assert

        expect(result).toEqual(updatedStudent);

        const options: FindOneOptions<StudentEntity> = {
            where: {
                id: 1
            }
        }

        expect(studentDAO.findOne).toHaveBeenCalledWith(options);
        expect(studentDAO.save).toHaveBeenCalledWith(changedStudentEntity);

        expect(studentMapper.fromStudentEntity).toHaveBeenCalledWith(updatedStudentEntity);
    });

    test('Should not update a student successfully due to invalid student id when update method is executed', async () => {
        // Arrange

        studentDAO.findOne.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.update(1, 2);

        // Assert

        expect(result).toBeUndefined();

        const options: FindOneOptions<StudentEntity> = {
            where: {
                id: 1
            }
        }

        expect(studentDAO.findOne).toHaveBeenCalledWith(options);
    });
});