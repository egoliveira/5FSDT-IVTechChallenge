import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {UserRepository} from "../../../../src/domain/repository/UserRepository";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {UpdateUserUseCase, UpdateUserUseCaseParams} from "../../../../src/domain/usecase/user/UpdateUserUseCase";

describe('UpdateUserUseCase class tests', () => {
    let userRepository: MockProxy<UserRepository>;
    let updatedUser: User;
    let useCase: UpdateUserUseCase;

    beforeEach(() => {
        userRepository = mock<UserRepository>()

        updatedUser = new User(
            1,
            'username',
            'new name',
            'newemail@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 1, 1, 0, 0, 0)
        );

        useCase = new UpdateUserUseCase(userRepository);
    });

    afterEach(() => {
        mockReset(userRepository);

        jest.restoreAllMocks();
    })

    test('Should update an user successfully when use case is executed', async () => {
        // Prepare

        userRepository.update.calledWith(1, 'new name', 'newemail@email.com', false).mockReturnValue(Promise.resolve(updatedUser));

        const params = new UpdateUserUseCaseParams(1, 'new name', 'newemail@email.com', false);

        // Act

        const user = await useCase.execute(params);

        // Assert

        expect(user).toBeDefined();

        expect(user?.id).toEqual(1);
        expect(user?.username).toEqual('username');
        expect(user?.name).toEqual('new name');
        expect(user?.email).toEqual('newemail@email.com');
        expect(user?.password).toEqual('$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q');
        expect(user?.active).toBeFalsy()
        expect(user?.createdAt).toEqual(new Date(2025, 0, 1, 0, 0, 0));
        expect(user?.updatedAt).toEqual(new Date(2025, 1, 1, 0, 0, 0));

        expect(userRepository.update).toHaveBeenCalledWith(
            1, 'new name', 'newemail@email.com', false
        );
    });

    test('Should not update an user successfully due to invalid user id when use case is executed', async () => {
        // Prepare

        userRepository.update.calledWith(1, 'new name', 'newemail@email.com', false).mockReturnValue(Promise.resolve(updatedUser));

        const params = new UpdateUserUseCaseParams(2, 'new name', 'newemail@email.com', false);

        // Act

        const user = await useCase.execute(params);

        // Assert

        expect(user).toBeUndefined();
    });
});