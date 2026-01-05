import "reflect-metadata";
import {describe} from "node:test";
import {RetrievePasswordSaltUseCase} from "../../../../src/domain/usecase/user/RetrievePasswordSaltUseCase";
import {CreateUserUseCase, CreateUserUseCaseParams} from "../../../../src/domain/usecase/user/CreateUserUseCase";
import {
    RetrievePasswordHashUseCase,
    RetrievePasswordHashUseCaseParams
} from "../../../../src/domain/usecase/user/RetrievePasswordHashUseCase";
import {mock, mockReset} from "jest-mock-extended";
import {UserRepository} from "../../../../src/domain/repository/UserRepository";
import {User} from "../../../../src/domain/vo/user/User";
import {UserRoles} from "../../../../src/domain/vo/user/UserRoles";
import {MockProxy} from "jest-mock-extended/lib/Mock";

describe('CreateUserUseCase class tests', () => {
    let retrievePasswordHashUseCase: MockProxy<RetrievePasswordHashUseCase>;
    let retrievePasswordSaltUseCase: MockProxy<RetrievePasswordSaltUseCase>;
    let userRepository: MockProxy<UserRepository>;
    let user: User;
    let createdUser: User;
    let userRoles: UserRoles;
    let useCase: CreateUserUseCase;

    beforeEach(() => {
        retrievePasswordHashUseCase = mock<RetrievePasswordHashUseCase>()
        retrievePasswordSaltUseCase = mock<RetrievePasswordSaltUseCase>();
        userRepository = mock<UserRepository>()

        user = new User(
            0,
            'username',
            'User',
            'user@email.com',
            'teste123',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        userRoles = new UserRoles(
            0,
            0,
            true,
            false,
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        createdUser = new User(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        retrievePasswordSaltUseCase.execute.mockReturnValue(Promise.resolve('$2b$10$cLCx2K/n.fifXma00IqTze'));

        retrievePasswordHashUseCase.execute.mockReturnValue(Promise.resolve('$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q'));

        userRepository.create.mockReturnValue(Promise.resolve(createdUser));

        useCase = new CreateUserUseCase(retrievePasswordHashUseCase, retrievePasswordSaltUseCase, userRepository);
    });

    afterEach(() => {
        mockReset(retrievePasswordHashUseCase);
        mockReset(retrievePasswordSaltUseCase);
        mockReset(userRepository);

        jest.restoreAllMocks();
    })

    test('Should create an user successfully when use case is executed', async () => {
        // Prepare

        userRepository.getByUsername.calledWith('username').mockReturnValue(Promise.resolve(undefined));

        const params = new CreateUserUseCaseParams(user, userRoles);

        // Act

        const newUser = await useCase.execute(params);

        // Assert

        expect(newUser).toBeDefined();

        expect(newUser.id).toEqual(1);
        expect(newUser.username).toEqual('username');
        expect(newUser.name).toEqual('User');
        expect(newUser.email).toEqual('user@email.com');
        expect(newUser.password).toEqual('$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q');
        expect(newUser.active).toBeTruthy();
        expect(newUser.createdAt).toEqual(new Date(2025, 0, 1, 0, 0, 0));
        expect(newUser.updatedAt).toEqual(new Date(2025, 0, 1, 0, 0, 0));

        expect(userRepository.getByUsername).toHaveBeenCalledWith('username');

        expect(retrievePasswordSaltUseCase.execute).toHaveBeenCalled();

        expect(retrievePasswordHashUseCase.execute).toHaveBeenCalledWith(new RetrievePasswordHashUseCaseParams('teste123', '$2b$10$cLCx2K/n.fifXma00IqTze'));

        expect(userRepository.create).toHaveBeenCalledWith(
            new User(0,
                'username',
                'User',
                'user@email.com',
                '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
                true,
                new Date(2025, 0, 1, 0, 0, 0),
                new Date(2025, 0, 1, 0, 0, 0)),
            new UserRoles(
                0,
                0,
                true,
                false,
                false,
                new Date(2025, 0, 1, 0, 0, 0),
                new Date(2025, 0, 1, 0, 0, 0)
            )
        );
    });

    test('Should not create an user successfully because user already exists when use case is executed', async () => {
        // Prepare

        userRepository.getByUsername.calledWith('username').mockReturnValue(Promise.resolve(createdUser));

        const params = new CreateUserUseCaseParams(user, userRoles);

        // Act

        await expect(useCase.execute(params)).rejects.toThrow('User username already exists.');
    });
});