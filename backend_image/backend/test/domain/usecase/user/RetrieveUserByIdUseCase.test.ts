import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {UserRepository} from "../../../../src/domain/repository/UserRepository";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {RetrieveUserByIdUseCase} from "../../../../src/domain/usecase/user/RetrieveUserByIdUseCase";

describe('RetrieveUserByIdUseCase class tests', () => {
    let userRepository: MockProxy<UserRepository>;
    let user: User;
    let useCase: RetrieveUserByIdUseCase;

    beforeEach(() => {
        userRepository = mock<UserRepository>()

        user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        useCase = new RetrieveUserByIdUseCase(userRepository);
    });

    afterEach(() => {
        mockReset(userRepository);

        jest.restoreAllMocks();
    })

    test('Should retrieve an user by its id successfully when use case is executed', async () => {
        // Prepare

        userRepository.getById.calledWith(1).mockReturnValue(Promise.resolve(user));

        // Act

        const foundUser = await useCase.execute(1);

        // Assert

        expect(foundUser).toBeDefined();

        expect(foundUser?.id).toEqual(1);
        expect(foundUser?.username).toEqual('username');
        expect(foundUser?.name).toEqual('User');
        expect(foundUser?.email).toEqual('user@email.com');
        expect(foundUser?.password).toEqual('$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q');
        expect(foundUser?.active).toBeTruthy();
        expect(foundUser?.createdAt).toEqual(new Date(2025, 0, 1, 0, 0, 0));
        expect(foundUser?.updatedAt).toEqual(new Date(2025, 0, 1, 0, 0, 0));

        expect(userRepository.getById).toHaveBeenCalledWith(1);
    });

    test('Should not retrieve an user by its id successfully due to invalid user id when use case is executed', async () => {
        // Prepare

        userRepository.getById.calledWith(1).mockReturnValue(Promise.resolve(user));

        // Act

        const foundUser = await useCase.execute(2);

        // Assert

        expect(foundUser).toBeUndefined();

        expect(userRepository.getById).toHaveBeenCalledWith(2);
    });
});