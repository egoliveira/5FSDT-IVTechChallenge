import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {FindParams} from "../../../../src/domain/vo/common/FindParams";
import {DataPage} from "../../../../src/domain/vo/common/DataPage";
import {
    FindStudentsUseCase,
    FindStudentsUseCaseParams
} from "../../../../src/domain/usecase/student/FindStudentsUseCase";
import {StudentRepository} from "../../../../src/domain/repository/StudentRepository";
import {Student} from "../../../../src/domain/vo/student/Student";
import {TeachingGrade} from "../../../../src/domain/vo/teachinggrade/TeachingGrade";
import {TeachingLevel} from "../../../../src/domain/vo/teachinglevel/TeachingLevel";
import {FindStudentsSortField} from "../../../../src/domain/vo/common/FindStudentsSortField";

describe('FindStudentsUseCase class tests', () => {
    let studentRepository: MockProxy<StudentRepository>;
    let useCase: FindStudentsUseCase;

    let student1: Student;
    let student2: Student;
    let user1: User;
    let user2: User;
    let teachingLevel: TeachingLevel;
    let teachingGrade: TeachingGrade;
    let dataPage: DataPage<Student>;

    beforeEach(() => {
        teachingLevel = new TeachingLevel(
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

        student1 = new Student(
            1,
            user1.id,
            user1,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 1, 1, 0, 0, 0),
            new Date(2025, 1, 1, 0, 0, 0)
        );

        user2 = new User(
            2,
            'user2',
            'User 2',
            'user2@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 1, 1, 0, 0, 0),
            new Date(2025, 1, 1, 0, 0, 0)
        );

        student2 = new Student(
            2,
            user2.id,
            user2,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 1, 1, 0, 0, 0),
            new Date(2025, 1, 1, 0, 0, 0)
        );

        const students = [student1, student2];

        dataPage = new DataPage(
            students,
            0,
            10,
            students.length
        );

        studentRepository = mock<StudentRepository>();

        useCase = new FindStudentsUseCase(studentRepository);
    });

    afterEach(() => {
        mockReset(studentRepository);

        jest.restoreAllMocks();
    })

    test('Should find students successfully when use case is executed', async () => {
        // Prepare

        const params = new FindStudentsUseCaseParams();

        const findParams = new FindParams<FindStudentsSortField>(undefined, undefined);

        studentRepository.find.mockReturnValue(Promise.resolve(dataPage));

        // Act

        const result = await useCase.execute(params);

        // Assert

        expect(result).toBeDefined();

        expect(result.data.length).toEqual(2)
        expect(result.data[0]).toEqual(student1);
        expect(result.data[1]).toEqual(student2);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(10);
        expect(result.total).toEqual(2);

        expect(studentRepository.find).toHaveBeenCalledWith(
            undefined,
            undefined,
            undefined,
            undefined,
            findParams
        );
    });
});