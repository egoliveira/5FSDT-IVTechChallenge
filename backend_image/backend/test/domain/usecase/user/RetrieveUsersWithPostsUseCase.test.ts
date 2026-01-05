import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {UserRepository} from "../../../../src/domain/repository/UserRepository";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {RetrieveUsersWithPostsUseCase} from "../../../../src/domain/usecase/user/RetrieveUsersWithPostsUseCase";

describe('RetrieveUsersWithPostsUseCase class tests', () => {
    let userRepository: MockProxy<UserRepository>;
    let useCase: RetrieveUsersWithPostsUseCase;

    let user1: User;
    let user2: User;

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

        userRepository = mock<UserRepository>();

        useCase = new RetrieveUsersWithPostsUseCase(userRepository);
    });

    afterEach(() => {
        mockReset(userRepository);

        jest.restoreAllMocks();
    })

    test('Should retrieve users with posts successfully when use case is executed', async () => {
        // Prepare

        const users = [user1, user2];

        userRepository.getWithPosts.mockReturnValue(Promise.resolve(users));

        // Act

        const result = await useCase.execute();

        // Assert

        expect(result).toBeDefined();

        expect(result.length).toEqual(2)
        expect(result[0]).toEqual(user1);
        expect(result[1]).toEqual(user2);

        expect(userRepository.getWithPosts).toHaveBeenCalled();
    });
});