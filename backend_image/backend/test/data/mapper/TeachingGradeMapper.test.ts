import "reflect-metadata";
import {describe} from "node:test";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {mock, mockReset} from "jest-mock-extended";
import {TeachingGradeMapper} from "../../../src/data/mapper/TeachingGradeMapper";
import {TeachingLevel} from "../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingGrade} from "../../../src/domain/vo/teachinggrade/TeachingGrade";
import {TeachingLevelEntity} from "../../../src/data/entity/TeachingLevelEntity";
import {TeachingGradeEntity} from "../../../src/data/entity/TeachingGradeEntity";
import {TeachingLevelMapper} from "../../../src/data/mapper/TeachingLevelMapper";

describe('TeachingGradeMapper class tests', () => {
    let teachingLevelMapper: MockProxy<TeachingLevelMapper>;

    let mapper: TeachingGradeMapper;

    beforeEach(() => {
        teachingLevelMapper = mock<TeachingLevelMapper>();

        mapper = new TeachingGradeMapper(teachingLevelMapper);
    });

    afterEach(() => {
        mockReset(teachingLevelMapper);

        jest.restoreAllMocks();
    })

    test('Should map a teaching grade value object to a teaching grade entity successfully', () => {
        // Prepare

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

        teachingLevelMapper.toTeachingLevelEntity.calledWith(teachingLevel).mockReturnValue(teachingLevelEntity);

        // Act

        const result = mapper.toTeachingGradeEntity(teachingGrade);

        // Assert

        expect(result.id).toEqual(teachingGrade.id);
        expect(result.name).toEqual(teachingGrade.name);
        expect(result.order).toEqual(teachingGrade.order);
        expect(result.teachingLevelId).toEqual(teachingGrade.teachingLevelId);
        expect(result.teachingLevel).toEqual(teachingLevelEntity);
        expect(result.createdAt).toEqual(teachingGrade.createdAt);
        expect(result.updatedAt).toEqual(teachingGrade.updatedAt);

        expect(teachingLevelMapper.toTeachingLevelEntity).toHaveBeenCalledWith(teachingLevel);
    });

    test('Should map a teaching grade entity object to a teaching grade value object successfully', () => {
        // Prepare

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

        const teachingGradeEntity = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingLevelMapper.fromTeachingLevelEntity.calledWith(teachingLevelEntity).mockReturnValue(teachingLevel);

        // Act

        const result = mapper.fromTeachingGradeEntity(teachingGradeEntity);

        // Assert

        expect(result.id).toEqual(teachingGradeEntity.id);
        expect(result.name).toEqual(teachingGradeEntity.name);
        expect(result.order).toEqual(teachingGradeEntity.order);
        expect(result.teachingLevelId).toEqual(teachingGradeEntity.teachingLevelId);
        expect(result.teachingLevel).toEqual(teachingLevel);
        expect(result.createdAt).toEqual(teachingGradeEntity.createdAt);
        expect(result.updatedAt).toEqual(teachingGradeEntity.updatedAt);

        expect(teachingLevelMapper.fromTeachingLevelEntity).toHaveBeenCalledWith(teachingLevelEntity);
    });

    test('Should map a list of teaching grade entity objects to a list of teaching grade value object list successfully', () => {
        // Prepare

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

        const teachingGradeEntity1 = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGradeEntity2 = new TeachingGradeEntity(
            2,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Segundo Ano',
            2,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingLevelMapper.fromTeachingLevelEntity.calledWith(teachingLevelEntity).mockReturnValue(teachingLevel);

        // Act

        const result = mapper.fromTeachingGradeEntities([teachingGradeEntity1, teachingGradeEntity2]);

        // Assert
        expect(result.length).toEqual(2);

        expect(result[0].id).toEqual(teachingGradeEntity1.id);
        expect(result[0].name).toEqual(teachingGradeEntity1.name);
        expect(result[0].order).toEqual(teachingGradeEntity1.order);
        expect(result[0].teachingLevelId).toEqual(teachingGradeEntity1.teachingLevelId);
        expect(result[0].teachingLevel).toEqual(teachingLevel);
        expect(result[0].createdAt).toEqual(teachingGradeEntity1.createdAt);
        expect(result[0].updatedAt).toEqual(teachingGradeEntity1.updatedAt);

        expect(result[1].id).toEqual(teachingGradeEntity2.id);
        expect(result[1].name).toEqual(teachingGradeEntity2.name);
        expect(result[1].order).toEqual(teachingGradeEntity2.order);
        expect(result[1].teachingLevelId).toEqual(teachingGradeEntity2.teachingLevelId);
        expect(result[1].teachingLevel).toEqual(teachingLevel);
        expect(result[1].createdAt).toEqual(teachingGradeEntity2.createdAt);
        expect(result[1].updatedAt).toEqual(teachingGradeEntity2.updatedAt);

        expect(teachingLevelMapper.fromTeachingLevelEntity).toHaveBeenNthCalledWith(2, teachingLevelEntity);
    });
});