import "reflect-metadata";
import {describe} from "node:test";
import {TeachingLevel} from "../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingLevelEntity} from "../../../src/data/entity/TeachingLevelEntity";
import {TeachingLevelMapper} from "../../../src/data/mapper/TeachingLevelMapper";

describe('TeachingLevelMapper class tests', () => {
    let mapper: TeachingLevelMapper;

    beforeEach(() => {
        mapper = new TeachingLevelMapper();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    })

    test('Should map a teaching level value object to a teaching level entity successfully', () => {
        // Prepare

        const teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        // Act

        const result = mapper.toTeachingLevelEntity(teachingLevel);

        // Assert

        expect(result.id).toEqual(teachingLevel.id);
        expect(result.name).toEqual(teachingLevel.name);
        expect(result.order).toEqual(teachingLevel.order);
        expect(result.createdAt).toEqual(teachingLevel.createdAt);
        expect(result.updatedAt).toEqual(teachingLevel.updatedAt);
    });

    test('Should map a teaching level entity object to a teaching level value object successfully', () => {
        // Prepare

        const teachingLevelEntity = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        // Act

        const result = mapper.fromTeachingLevelEntity(teachingLevelEntity);

        // Assert

        expect(result.id).toEqual(teachingLevelEntity.id);
        expect(result.name).toEqual(teachingLevelEntity.name);
        expect(result.order).toEqual(teachingLevelEntity.order);
        expect(result.createdAt).toEqual(teachingLevelEntity.createdAt);
        expect(result.updatedAt).toEqual(teachingLevelEntity.updatedAt);
    });

    test('Should map a list of teaching level entity objects to a list of teaching level value object list successfully', () => {
        // Prepare

        const teachingLevelEntity1 = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevelEntity2 = new TeachingLevelEntity(
            2,
            'Ensino Médio',
            2,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        // Act

        const result = mapper.fromTeachingLevelEntities([teachingLevelEntity1, teachingLevelEntity2]);

        // Assert
        expect(result.length).toEqual(2);

        expect(result[0].id).toEqual(teachingLevelEntity1.id);
        expect(result[0].name).toEqual(teachingLevelEntity1.name);
        expect(result[0].order).toEqual(teachingLevelEntity1.order);
        expect(result[0].createdAt).toEqual(teachingLevelEntity1.createdAt);
        expect(result[0].updatedAt).toEqual(teachingLevelEntity1.updatedAt);

        expect(result[1].id).toEqual(teachingLevelEntity2.id);
        expect(result[1].name).toEqual(teachingLevelEntity2.name);
        expect(result[1].order).toEqual(teachingLevelEntity2.order);
        expect(result[1].createdAt).toEqual(teachingLevelEntity2.createdAt);
        expect(result[1].updatedAt).toEqual(teachingLevelEntity2.updatedAt);
    });
});