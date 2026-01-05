import "reflect-metadata";
import {describe} from "node:test";
import {RetrievePasswordSaltUseCase} from "../../../../src/domain/usecase/user/RetrievePasswordSaltUseCase";
import {
    RetrievePasswordHashUseCase,
    RetrievePasswordHashUseCaseParams
} from "../../../../src/domain/usecase/user/RetrievePasswordHashUseCase";
import {mock, mockReset} from "jest-mock-extended";
import {UserRepository} from "../../../../src/domain/repository/UserRepository";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {
    ChangeUserPasswordUseCase,
    ChangeUserPasswordUseCaseParams
} from "../../../../src/domain/usecase/user/ChangeUserPasswordUseCase";

describe('ChangeUserPasswordUseCase class tests', () => {
    let retrievePasswordHashUseCase: MockProxy<RetrievePasswordHashUseCase>;
    let retrievePasswordSaltUseCase: MockProxy<RetrievePasswordSaltUseCase>;
    let userRepository: MockProxy<UserRepository>;
    let useCase: ChangeUserPasswordUseCase;

    let user: User;
    let passwordChangedUser: User;

    beforeEach(() => {
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

        passwordChangedUser = new User(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$bBZ5izu2D04jD0pcbLktyetTiXTAkrNNgIKL6W6fle6167bVRw9E6',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 2, 0, 0, 0)
        );

        retrievePasswordHashUseCase = mock<RetrievePasswordHashUseCase>()
        retrievePasswordSaltUseCase = mock<RetrievePasswordSaltUseCase>();
        userRepository = mock<UserRepository>();

        retrievePasswordSaltUseCase.execute.mockReturnValue(Promise.resolve('$2b$10$bBZ5izu2D04jD0pcbLktye'));

        retrievePasswordHashUseCase.execute.mockReturnValue(Promise.resolve('$2b$10$bBZ5izu2D04jD0pcbLktyetTiXTAkrNNgIKL6W6fle6167bVRw9E6'));

        userRepository.changePassword.calledWith(1, '$2b$10$bBZ5izu2D04jD0pcbLktyetTiXTAkrNNgIKL6W6fle6167bVRw9E6').mockReturnValue(Promise.resolve(passwordChangedUser));

        useCase = new ChangeUserPasswordUseCase(retrievePasswordHashUseCase, retrievePasswordSaltUseCase, userRepository);
    });

    afterEach(() => {
        mockReset(retrievePasswordHashUseCase);
        mockReset(retrievePasswordSaltUseCase);
        mockReset(userRepository);

        jest.restoreAllMocks();
    })

    test('Should change user password successfully when use case is executed', async () => {
        // Prepare

        userRepository.getById.calledWith(1).mockReturnValue(Promise.resolve(user));

        const params = new ChangeUserPasswordUseCaseParams(1, 'newPassword');

        // Act

        const passwordChangedUser = await useCase.execute(params);

        // Assert

        expect(passwordChangedUser).toBeDefined();

        expect(passwordChangedUser?.id).toEqual(1);
        expect(passwordChangedUser?.username).toEqual('username');
        expect(passwordChangedUser?.name).toEqual('User');
        expect(passwordChangedUser?.email).toEqual('user@email.com');
        expect(passwordChangedUser?.password).toEqual('$2b$10$bBZ5izu2D04jD0pcbLktyetTiXTAkrNNgIKL6W6fle6167bVRw9E6');
        expect(passwordChangedUser?.active).toBeTruthy();
        expect(passwordChangedUser?.createdAt).toEqual(new Date(2025, 0, 1, 0, 0, 0));
        expect(passwordChangedUser?.updatedAt).toEqual(new Date(2025, 0, 2, 0, 0, 0));

        expect(userRepository.getById).toHaveBeenCalledWith(1);

        expect(retrievePasswordSaltUseCase.execute).toHaveBeenCalled();

        expect(retrievePasswordHashUseCase.execute).toHaveBeenCalledWith(new RetrievePasswordHashUseCaseParams('newPassword', '$2b$10$bBZ5izu2D04jD0pcbLktye'));

        expect(userRepository.changePassword).toHaveBeenCalledWith(1, '$2b$10$bBZ5izu2D04jD0pcbLktyetTiXTAkrNNgIKL6W6fle6167bVRw9E6');
    });

    test('Should not change user password successfully due to user not found when use case is executed', async () => {
        // Prepare

        userRepository.getById.calledWith(1).mockReturnValue(Promise.resolve(undefined));

        const params = new ChangeUserPasswordUseCaseParams(1, 'newPassword');

        // Act

        await expect(useCase.execute(params)).rejects.toThrow('Invalid user id.');

        // Assert

        expect(userRepository.getById).toHaveBeenCalledWith(1);
    });
});