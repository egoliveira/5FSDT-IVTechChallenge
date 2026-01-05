import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {TeachingLevel} from "../../../../src/domain/vo/teachinglevel/TeachingLevel";
import {
    RetrieveTeachingGradesByTeachingLevelIdUseCase
} from "../../../../src/domain/usecase/teachinggrades/RetrieveTeachingGradesByTeachingLevelIdUseCase";
import {TeachingGradeRepository} from "../../../../src/domain/repository/TeachingGradeRepository";
import {TeachingGrade} from "../../../../src/domain/vo/teachinggrade/TeachingGrade";

describe('RetrieveTeachingGradesByTeachingLevelIdUseCase class tests', () => {
    let teachingGradeRepository: MockProxy<TeachingGradeRepository>;
    let useCase: RetrieveTeachingGradesByTeachingLevelIdUseCase;

    beforeEach(() => {
        teachingGradeRepository = mock<TeachingGradeRepository>();

        useCase = new RetrieveTeachingGradesByTeachingLevelIdUseCase(teachingGradeRepository);
    });

    afterEach(() => {
        mockReset(teachingGradeRepository);

        jest.restoreAllMocks();
    })

    test('Should retrieve teaching grades by id successfully when use case is executed', async () => {
        // Prepare

        const teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGrade1 = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGrade2 = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Segundo Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGrades = [teachingGrade1, teachingGrade2];

        teachingGradeRepository.getByTeachingLevelId.calledWith(1).mockReturnValue(Promise.resolve(teachingGrades));

        // Act

        const result = await useCase.execute(1);

        // Assert

        expect(result).toBeDefined();

        expect(result.length).toEqual(2)
        expect(result[0]).toEqual(teachingGrade1);
        expect(result[1]).toEqual(teachingGrade2);

        expect(teachingGradeRepository.getByTeachingLevelId).toHaveBeenCalledWith(1);
    });
});