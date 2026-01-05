import {describe} from "node:test";
import {DeepMockProxy, mockDeep, MockProxy} from "jest-mock-extended/lib/Mock";
import {StudentDAO} from "../../../src/data/dao/StudentDAO";
import {mock, mockReset} from "jest-mock-extended";
import {UserRolesDAO} from "../../../src/data/dao/UserRolesDAO";
import {UserRolesMapper} from "../../../src/data/mapper/UserRolesMapper";
import {UserRolesRepositoryImpl} from "../../../src/data/repository/UserRolesRepositoryImpl";
import {FindOneOptions} from "typeorm";
import {UserRoles} from "../../../src/domain/vo/user/UserRoles";
import {UserRolesEntity} from "../../../src/data/entity/UserRolesEntity";

describe('UserRolesRepositoryImpl class tests', () => {
    let userRolesDAO: DeepMockProxy<UserRolesDAO>;
    let studentDAO: DeepMockProxy<StudentDAO>;
    let userRolesMapper: MockProxy<UserRolesMapper>;

    let userRoles: UserRoles;
    let userRolesEntity: UserRolesEntity;

    let repository: UserRolesRepositoryImpl;

    beforeEach(() => {
        userRolesDAO = mockDeep<UserRolesDAO>();
        studentDAO = mockDeep<StudentDAO>();
        userRolesMapper = mock<UserRolesMapper>();

        userRoles = new UserRoles(
            1,
            1,
            true,
            false,
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        userRolesEntity = new UserRolesEntity(
            1,
            1,
            true,
            false,
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        repository = new UserRolesRepositoryImpl(userRolesDAO, studentDAO, userRolesMapper);
    });

    afterEach(() => {
        mockReset(userRolesDAO);
        mockReset(studentDAO);
        mockReset(userRolesMapper);

        jest.restoreAllMocks();
    });

    test('Should retrieve the user roles of an user by its user id successfully when getByUserId method is executed', async () => {
        // Arrange

        userRolesDAO.findOne.mockReturnValue(Promise.resolve(userRolesEntity));

        userRolesMapper.fromUserRolesEntity.calledWith(userRolesEntity).mockReturnValue(userRoles);

        // Act

        const result = await repository.getByUserId(1);

        // Assert

        expect(result).toEqual(userRoles);

        const options: FindOneOptions<UserRolesEntity> = {
            where: {
                userId: 1,
            }
        }

        expect(userRolesDAO.findOne).toHaveBeenCalledWith(options);
        expect(userRolesMapper.fromUserRolesEntity).toHaveBeenCalledWith(userRolesEntity);
    });

    test('Should not retrieve the user roles of an user by its user id successfully due to invalid user id when getByUserId method is executed', async () => {
        // Arrange

        userRolesDAO.findOne.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.getByUserId(1);

        // Assert

        expect(result).toBeUndefined();

        const options: FindOneOptions<UserRolesEntity> = {
            where: {
                userId: 1,
            }
        }

        expect(userRolesDAO.findOne).toHaveBeenCalledWith(options);
    });
});
