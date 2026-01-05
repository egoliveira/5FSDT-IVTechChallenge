import {describe} from "node:test";
import {DeepMockProxy, mockDeep, MockProxy} from "jest-mock-extended/lib/Mock";
import {mock, mockReset} from "jest-mock-extended";
import {TeachingGradeRepositoryImpl} from "../../../src/data/repository/TeachingGradeRepositoryImpl";
import {TeachingGradeDAO} from "../../../src/data/dao/TeachingGradeDAO";
import {TeachingGradeMapper} from "../../../src/data/mapper/TeachingGradeMapper";
import {FindManyOptions} from "typeorm";
import {SortOrder} from "../../../src/domain/vo/common/SortOrder";
import {TeachingLevel} from "../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingLevelEntity} from "../../../src/data/entity/TeachingLevelEntity";
import {TeachingGrade} from "../../../src/domain/vo/teachinggrade/TeachingGrade";
import {TeachingGradeEntity} from "../../../src/data/entity/TeachingGradeEntity";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";

describe('TeachingGradeRepositoryImpl class tests', () => {
    let teachingGradeDAO: DeepMockProxy<TeachingGradeDAO>;
    let teachingGradeMapper: MockProxy<TeachingGradeMapper>;

    let teachingLevel: TeachingLevel;
    let teachingLevelEntity: TeachingLevelEntity;
    let teachingGrade1: TeachingGrade;
    let teachingGrade2: TeachingGrade;
    let teachingGrade1Entity: TeachingGradeEntity;
    let teachingGrade2Entity: TeachingGradeEntity;

    let repository: TeachingGradeRepositoryImpl;

    beforeEach(() => {
        teachingGradeDAO = mockDeep<TeachingGradeDAO>();
        teachingGradeMapper = mock<TeachingGradeMapper>();

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

        teachingGrade1 = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingGrade2 = new TeachingGrade(
            2,
            teachingLevel.id,
            teachingLevel,
            'Segundo Ano',
            2,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingGrade1Entity = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingGrade2Entity = new TeachingGradeEntity(
            2,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Segundo Ano',
            2,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        repository = new TeachingGradeRepositoryImpl(teachingGradeDAO, teachingGradeMapper);
    });

    afterEach(() => {
        mockReset(teachingGradeDAO);
        mockReset(teachingGradeMapper);

        jest.restoreAllMocks();
    });

    test('Should retrieve all teaching grades by teaching level id successfully when getByTeachingLevelId method is executed', async () => {
        // Arrange

        const teachingGradeEntities = [teachingGrade1Entity, teachingGrade2Entity];

        const teachingGrades = [teachingGrade1, teachingGrade2];

        teachingGradeDAO.find.mockReturnValue(Promise.resolve(teachingGradeEntities));

        teachingGradeMapper.fromTeachingGradeEntities.mockReturnValue(teachingGrades);

        // Act

        const result = await repository.getByTeachingLevelId(1);

        // Assert

        const expectedFindOptions: FindManyOptions<TeachingGradeEntity> = {
            where: {
                teachingLevelId: 1
            },
            order: {
                order: SortOrder.ASC,
            }
        }

        expect(result).toEqual(teachingGrades);

        expect(teachingGradeDAO.find).toHaveBeenCalledWith(expectedFindOptions);
        expect(teachingGradeMapper.fromTeachingGradeEntities).toHaveBeenCalledWith(teachingGradeEntities);
    });

    test('Should retrieve a teaching grade by its id successfully when getById method is executed', async () => {
        // Arrange

        teachingGradeDAO.findOneBy.mockReturnValue(Promise.resolve(teachingGrade1Entity));

        teachingGradeMapper.fromTeachingGradeEntity.mockReturnValue(teachingGrade1);

        // Act

        const result = await repository.getById(1);

        // Assert

        const expectedFindOptions: FindOptionsWhere<TeachingGradeEntity> = {
            id: 1
        }

        expect(result).toEqual(teachingGrade1);

        expect(teachingGradeDAO.findOneBy).toHaveBeenCalledWith(expectedFindOptions);
        expect(teachingGradeMapper.fromTeachingGradeEntity).toHaveBeenCalledWith(teachingGrade1Entity);
    });

    test('Should not retrieve a teaching grade by its id successfully due to invalid teaching grade id when getById method is executed', async () => {
        // Arrange

        teachingGradeDAO.findOneBy.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.getById(1);

        // Assert

        const expectedFindOptions: FindOptionsWhere<TeachingGradeEntity> = {
            id: 1
        }

        expect(result).toBeUndefined();

        expect(teachingGradeDAO.findOneBy).toHaveBeenCalledWith(expectedFindOptions);
    });
});