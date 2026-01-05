import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {UserRepository} from "../../../../src/domain/repository/UserRepository";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {FindUsersUseCase, FindUsersUseCaseParams} from "../../../../src/domain/usecase/user/FindUsersUseCase";
import {FindParams} from "../../../../src/domain/vo/common/FindParams";
import {DataPage} from "../../../../src/domain/vo/common/DataPage";
import {FindUsersSortField} from "../../../../src/domain/vo/common/FindUsersSortField";

describe('FindUsersUseCase class tests', () => {
    let userRepository: MockProxy<UserRepository>;
    let useCase: FindUsersUseCase;

    let user1: User;
    let user2: User;
    let dataPage: DataPage<User>;

    beforeEach(() => {
        user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        user2 = new User(
            2,
            'user2',
            'User 2',
            'user2@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 1, 1, 0, 0, 0),
            new Date(2025, 1, 1, 0, 0, 0)
        );

        const users = [user1, user2];

        dataPage = new DataPage(
            users,
            0,
            10,
            users.length
        );

        userRepository = mock<UserRepository>();

        useCase = new FindUsersUseCase(userRepository);
    });

    afterEach(() => {
        mockReset(userRepository);

        jest.restoreAllMocks();
    })

    test('Should find users successfully when use case is executed', async () => {
        // Prepare

        const params = new FindUsersUseCaseParams();

        const findParams = new FindParams<FindUsersSortField>(undefined, undefined);

        userRepository.find.mockReturnValue(Promise.resolve(dataPage));

        // Act

        const result = await useCase.execute(params);

        // Assert

        expect(result).toBeDefined();

        expect(result.data.length).toEqual(2)
        expect(result.data[0]).toEqual(user1);
        expect(result.data[1]).toEqual(user2);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(10);
        expect(result.total).toEqual(2);

        expect(userRepository.find).toHaveBeenCalledWith(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            findParams
        );
    });
});