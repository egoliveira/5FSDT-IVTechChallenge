import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {RetrieveAllSubjectsUseCase} from "../../../../src/domain/usecase/subject/RetrieveAllSubjectsUseCase";
import {SubjectRepository} from "../../../../src/domain/repository/SubjectRepository";
import {Subject} from "../../../../src/domain/vo/subject/Subject";

describe('RetrieveAllSubjectsUseCase class tests', () => {
    let subjectRepository: MockProxy<SubjectRepository>;
    let useCase: RetrieveAllSubjectsUseCase;

    beforeEach(() => {
        subjectRepository = mock<SubjectRepository>();

        useCase = new RetrieveAllSubjectsUseCase(subjectRepository);
    });

    afterEach(() => {
        mockReset(subjectRepository);

        jest.restoreAllMocks();
    })

    test('Should retrieve all subjects successfully when use case is executed', async () => {
        // Prepare

        const subject1 = new Subject(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const subject2 = new Subject(
            2,
            'Física',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const subjects = [subject1, subject2];

        subjectRepository.getAll.mockReturnValue(Promise.resolve(subjects));

        // Act

        const result = await useCase.execute();

        // Assert

        expect(result).toBeDefined();

        expect(result.length).toEqual(2)
        expect(result[0]).toEqual(subject1);
        expect(result[1]).toEqual(subject2);

        expect(subjectRepository.getAll).toHaveBeenCalled();
    });
});