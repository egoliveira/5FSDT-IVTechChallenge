import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {RetrieveStudentByIdUseCase} from "../../../../src/domain/usecase/student/RetrieveStudentByIdUseCase";
import {StudentRepository} from "../../../../src/domain/repository/StudentRepository";
import {Student} from "../../../../src/domain/vo/student/Student";
import {TeachingLevel} from "../../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingGrade} from "../../../../src/domain/vo/teachinggrade/TeachingGrade";

describe('RetrieveStudentByIdUseCase class tests', () => {
    let studentRepository: MockProxy<StudentRepository>;
    let student: Student;
    let user: User;
    let teachingLevel: TeachingLevel;
    let teachingGrade: TeachingGrade;
    let useCase: RetrieveStudentByIdUseCase;

    beforeEach(() => {
        studentRepository = mock<StudentRepository>();

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

        user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        student = new Student(
            1,
            user.id,
            user,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 1, 1, 0, 0, 0),
            new Date(2025, 1, 1, 0, 0, 0)
        );

        studentRepository.getById.calledWith(1).mockReturnValue(Promise.resolve(student));

        useCase = new RetrieveStudentByIdUseCase(studentRepository);
    });

    afterEach(() => {
        mockReset(studentRepository);

        jest.restoreAllMocks();
    })

    test('Should retrieve a student by its id successfully when use case is executed', async () => {
        // Act

        const foundStudent = await useCase.execute(1);

        // Assert

        expect(foundStudent).toBeDefined();

        expect(foundStudent).toEqual(student);

        expect(studentRepository.getById).toHaveBeenCalledWith(1);
    });

    test('Should not retrieve a student by its id successfully due to invalid student id when use case is executed', async () => {
        // Act

        const foundStudent = await useCase.execute(2);

        // Assert

        expect(foundStudent).toBeUndefined();

        expect(studentRepository.getById).toHaveBeenCalledWith(2);
    });
});