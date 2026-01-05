import "reflect-metadata";
import {describe} from "node:test";
import {Subject} from "../../../src/domain/vo/subject/Subject";
import {SubjectMapper} from "../../../src/data/mapper/SubjectMapper";
import {SubjectEntity} from "../../../src/data/entity/SubjectEntity";

describe('SubjectMapper class tests', () => {
    let mapper: SubjectMapper;

    beforeEach(() => {
        mapper = new SubjectMapper();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    })

    test('Should map a subject value object to a subject entity successfully', () => {
        // Prepare

        const subject = new Subject(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        // Act

        const result = mapper.toSubjectEntity(subject);

        // Assert

        expect(result.id).toEqual(subject.id);
        expect(result.name).toEqual(subject.name);
        expect(result.createdAt).toEqual(subject.createdAt);
        expect(result.updatedAt).toEqual(subject.updatedAt);
    });

    test('Should map a subject entity object to a subject value object successfully', () => {
        // Prepare

        const subjectEntity = new SubjectEntity(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        // Act

        const result = mapper.fromSubjectEntity(subjectEntity);

        // Assert

        expect(result.id).toEqual(subjectEntity.id);
        expect(result.name).toEqual(subjectEntity.name);
        expect(result.createdAt).toEqual(subjectEntity.createdAt);
        expect(result.updatedAt).toEqual(subjectEntity.updatedAt);
    });

    test('Should map a list of subject entity objects to a list of subject value object list successfully', () => {
        // Prepare

        const subjectEntity1 = new SubjectEntity(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const subjectEntity2 = new SubjectEntity(
            2,
            'Física',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        // Act

        const result = mapper.fromSubjectEntities([subjectEntity1, subjectEntity2]);

        // Assert
        expect(result.length).toEqual(2);

        expect(result[0].id).toEqual(subjectEntity1.id);
        expect(result[0].name).toEqual(subjectEntity1.name);
        expect(result[0].createdAt).toEqual(subjectEntity1.createdAt);
        expect(result[0].updatedAt).toEqual(subjectEntity1.updatedAt);

        expect(result[1].id).toEqual(subjectEntity2.id);
        expect(result[1].name).toEqual(subjectEntity2.name);
        expect(result[1].createdAt).toEqual(subjectEntity2.createdAt);
        expect(result[1].updatedAt).toEqual(subjectEntity2.updatedAt);
    });
});