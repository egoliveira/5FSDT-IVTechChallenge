import {describe} from "node:test";
import {DeepMockProxy, mockDeep, MockProxy} from "jest-mock-extended/lib/Mock";
import {mock, mockReset} from "jest-mock-extended";
import {FindManyOptions} from "typeorm";
import {SortOrder} from "../../../src/domain/vo/common/SortOrder";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";
import {SubjectDAO} from "../../../src/data/dao/SubjectDAO";
import {SubjectMapper} from "../../../src/data/mapper/SubjectMapper";
import {SubjectRepositoryImpl} from "../../../src/data/repository/SubjectRepositoryImpl";
import {Subject} from "../../../src/domain/vo/subject/Subject";
import {SubjectEntity} from "../../../src/data/entity/SubjectEntity";

describe('SubjectRepositoryImpl class tests', () => {
    let subjectDAO: DeepMockProxy<SubjectDAO>;
    let subjectMapper: MockProxy<SubjectMapper>;

    let subject1: Subject;
    let subject2: Subject;
    let subject1Entity: SubjectEntity;
    let subject2Entity: SubjectEntity;

    let repository: SubjectRepositoryImpl;

    beforeEach(() => {
        subjectDAO = mockDeep<SubjectDAO>();
        subjectMapper = mock<SubjectMapper>();

        subject1 = new Subject(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        subject2 = new Subject(
            2,
            'Física',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        subject1Entity = new SubjectEntity(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        subject2Entity = new SubjectEntity(
            2,
            'Física',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        repository = new SubjectRepositoryImpl(subjectDAO, subjectMapper);
    });

    afterEach(() => {
        mockReset(subjectDAO);
        mockReset(subjectMapper);

        jest.restoreAllMocks();
    });

    test('Should retrieve all subjects successfully when getAll method is executed', async () => {
        // Arrange

        const subjectEntities = [subject1Entity, subject2Entity];

        const subjects = [subject1, subject2];

        subjectDAO.find.mockReturnValue(Promise.resolve(subjectEntities));

        subjectMapper.fromSubjectEntities.mockReturnValue(subjects);

        // Act

        const result = await repository.getAll();

        // Assert

        const expectedFindOptions: FindManyOptions<SubjectEntity> = {
            order: {
                name: SortOrder.ASC
            }
        }

        expect(result).toEqual(subjects);

        expect(subjectDAO.find).toHaveBeenCalledWith(expectedFindOptions);
        expect(subjectMapper.fromSubjectEntities).toHaveBeenCalledWith(subjectEntities);
    });

    test('Should retrieve a subject by its id successfully when getById method is executed', async () => {
        // Arrange

        subjectDAO.findOneBy.mockReturnValue(Promise.resolve(subject1Entity));

        subjectMapper.fromSubjectEntity.mockReturnValue(subject1);

        // Act

        const result = await repository.getById(1);

        // Assert

        const expectedFindOptions: FindOptionsWhere<SubjectEntity> = {
            id: 1
        }

        expect(result).toEqual(subject1);

        expect(subjectDAO.findOneBy).toHaveBeenCalledWith(expectedFindOptions);
        expect(subjectMapper.fromSubjectEntity).toHaveBeenCalledWith(subject1Entity);
    });

    test('Should not retrieve a subject by its id successfully due to invalid subject id when getById method is executed', async () => {
        // Arrange

        subjectDAO.findOneBy.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.getById(1);

        // Assert

        const expectedFindOptions: FindOptionsWhere<SubjectEntity> = {
            id: 1
        }

        expect(result).toBeUndefined();

        expect(subjectDAO.findOneBy).toHaveBeenCalledWith(expectedFindOptions);
    });
});