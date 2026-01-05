import {describe} from "node:test";
import {DeepMockProxy, mockDeep, MockProxy} from "jest-mock-extended/lib/Mock";
import {mock, mockReset} from "jest-mock-extended";
import {FindManyOptions} from "typeorm";
import {SortOrder} from "../../../src/domain/vo/common/SortOrder";
import {TeachingLevelDAO} from "../../../src/data/dao/TeachingLevelDAO";
import {TeachingLevelMapper} from "../../../src/data/mapper/TeachingLevelMapper";
import {TeachingLevel} from "../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingLevelEntity} from "../../../src/data/entity/TeachingLevelEntity";
import {TeachingLevelRepositoryImpl} from "../../../src/data/repository/TeachingLevelRepositoryImpl";

describe('TeachingLevelRepositoryImpl class tests', () => {
    let teachingLevelDAO: DeepMockProxy<TeachingLevelDAO>;
    let teachingLevelMapper: MockProxy<TeachingLevelMapper>;

    let teachingLevel1: TeachingLevel;
    let teachingLevel2: TeachingLevel;
    let teachingLevel1Entity: TeachingLevelEntity;
    let teachingLevel2Entity: TeachingLevelEntity;

    let repository: TeachingLevelRepositoryImpl;

    beforeEach(() => {
        teachingLevelDAO = mockDeep<TeachingLevelDAO>();
        teachingLevelMapper = mock<TeachingLevelMapper>();

        teachingLevel1 = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingLevel2 = new TeachingLevel(
            2,
            'Ensino Médio',
            2,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingLevel1Entity = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingLevel2Entity = new TeachingLevelEntity(
            2,
            'Ensino Médio',
            2,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        repository = new TeachingLevelRepositoryImpl(teachingLevelDAO, teachingLevelMapper);
    });

    afterEach(() => {
        mockReset(teachingLevelDAO);
        mockReset(teachingLevelMapper);

        jest.restoreAllMocks();
    });

    test('Should retrieve all teaching levels successfully when getAll method is executed', async () => {
        // Arrange

        const teachingLevelEntities = [teachingLevel1Entity, teachingLevel2Entity];

        const teachingLevels = [teachingLevel1, teachingLevel2];

        teachingLevelDAO.find.mockReturnValue(Promise.resolve(teachingLevelEntities));

        teachingLevelMapper.fromTeachingLevelEntities.mockReturnValue(teachingLevels);

        // Act

        const result = await repository.getAll();

        // Assert

        const expectedFindOptions: FindManyOptions<TeachingLevelEntity> = {
            order: {
                order: SortOrder.ASC
            }
        }

        expect(result).toEqual(teachingLevels);

        expect(teachingLevelDAO.find).toHaveBeenCalledWith(expectedFindOptions);
        expect(teachingLevelMapper.fromTeachingLevelEntities).toHaveBeenCalledWith(teachingLevelEntities);
    });
});