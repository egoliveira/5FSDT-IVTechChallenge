import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {
    RetrieveAllTeachingLevelsUseCase
} from "../../../../src/domain/usecase/teachinglevel/RetrieveAllTeachingLevelsUseCase";
import {TeachingLevelRepository} from "../../../../src/domain/repository/TeachingLevelRepository";
import {TeachingLevel} from "../../../../src/domain/vo/teachinglevel/TeachingLevel";

describe('RetrieveAllTeachingLevelsUseCase class tests', () => {
    let teachingLevelRepository: MockProxy<TeachingLevelRepository>;
    let useCase: RetrieveAllTeachingLevelsUseCase;

    beforeEach(() => {
        teachingLevelRepository = mock<TeachingLevelRepository>();

        useCase = new RetrieveAllTeachingLevelsUseCase(teachingLevelRepository);
    });

    afterEach(() => {
        mockReset(teachingLevelRepository);

        jest.restoreAllMocks();
    })

    test('Should retrieve all teaching levels successfully when use case is executed', async () => {
        // Prepare

        const teachingLevel1 = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevel2 = new TeachingLevel(
            1,
            'Ensino Médio',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevels = [teachingLevel1, teachingLevel2];

        teachingLevelRepository.getAll.mockReturnValue(Promise.resolve(teachingLevels));

        // Act

        const result = await useCase.execute();

        // Assert

        expect(result).toBeDefined();

        expect(result.length).toEqual(2)
        expect(result[0]).toEqual(teachingLevel1);
        expect(result[1]).toEqual(teachingLevel2);

        expect(teachingLevelRepository.getAll).toHaveBeenCalled();
    });
});