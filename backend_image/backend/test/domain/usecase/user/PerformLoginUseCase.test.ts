import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {UserRepository} from "../../../../src/domain/repository/UserRepository";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {PerformLoginUseCase, PerformLoginUseCaseParams} from "../../../../src/domain/usecase/user/PerformLoginUseCase";

describe('PerformLoginUseCase class tests', () => {
    let userRepository: MockProxy<UserRepository>;
    let useCase: PerformLoginUseCase;

    let user: User;

    beforeEach(() => {
        user = new User(
            1,
            'user',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        userRepository = mock<UserRepository>();

        useCase = new PerformLoginUseCase(userRepository);
    });

    afterEach(() => {
        mockReset(userRepository);

        jest.restoreAllMocks();
    })

    test('Should perform login successfully when use case is executed', async () => {
        // Prepare

        const params = new PerformLoginUseCaseParams('user', 'teste123');

        userRepository.getByUsername.calledWith('user').mockReturnValue(Promise.resolve(user))

        // Act

        const result = await useCase.execute(params);

        // Assert

        expect(result).toBeDefined();

        expect(user.id).toEqual(1);
        expect(user.username).toEqual('user');
        expect(user.name).toEqual('User');
        expect(user.email).toEqual('user@email.com');
        expect(user.password).toEqual('$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q');
        expect(user.active).toBeTruthy();
        expect(user.createdAt).toEqual(new Date(2025, 0, 1, 0, 0, 0));
        expect(user.updatedAt).toEqual(new Date(2025, 0, 1, 0, 0, 0));

        expect(userRepository.getByUsername).toHaveBeenCalledWith('user');
    });

    test('Should not perform login successfully due to inactive user when use case is executed', async () => {
        // Prepare

        user.active = false

        const params = new PerformLoginUseCaseParams('user', 'teste123');

        userRepository.getByUsername.calledWith('user').mockReturnValue(Promise.resolve(user))

        // Act

        const result = await useCase.execute(params);

        // Assert

        expect(result).toBeUndefined();

        expect(userRepository.getByUsername).toHaveBeenCalledWith('user');
    });

    test('Should not perform login successfully due invalid password when use case is executed', async () => {
        // Prepare

        const params = new PerformLoginUseCaseParams('user', 'teste');

        userRepository.getByUsername.calledWith('user').mockReturnValue(Promise.resolve(user))

        // Act

        const result = await useCase.execute(params);

        // Assert

        expect(result).toBeUndefined();

        expect(userRepository.getByUsername).toHaveBeenCalledWith('user');
    });
});