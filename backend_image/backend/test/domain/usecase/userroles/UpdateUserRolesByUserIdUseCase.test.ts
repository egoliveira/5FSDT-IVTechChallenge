import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {UserRolesRepository} from "../../../../src/domain/repository/UserRolesRepository";
import {UserRoles} from "../../../../src/domain/vo/user/UserRoles";
import {
    UpdateUserRolesByUserIdUseCase,
    UpdateUserRolesByUserIdUseCaseParams
} from "../../../../src/domain/usecase/userroles/UpdateUserRolesByUserIdUseCase";

describe('UpdateUserRolesByUserIdUseCase class tests', () => {
    let userRolesRepository: MockProxy<UserRolesRepository>;
    let currentUserRoles: UserRoles;
    let updatedUserRoles: UserRoles;
    let useCase: UpdateUserRolesByUserIdUseCase;

    beforeEach(() => {
        userRolesRepository = mock<UserRolesRepository>()

        currentUserRoles = new UserRoles(
            1, 2, false, true, false
        );

        updatedUserRoles = new UserRoles(
            1, 2, false, false, true
        );

        userRolesRepository.getByUserId.calledWith(1).mockReturnValue(Promise.resolve(currentUserRoles))

        useCase = new UpdateUserRolesByUserIdUseCase(userRolesRepository);
    });

    afterEach(() => {
        mockReset(userRolesRepository);

        jest.restoreAllMocks();
    })

    test('Should update the roles for an user successfully when use case is executed', async () => {
        // Prepare

        const params = new UpdateUserRolesByUserIdUseCaseParams(1, 2, false, false, true);

        userRolesRepository.updateByUserId.calledWith(2, false, false, true).mockReturnValue(Promise.resolve(updatedUserRoles));

        // Act

        const foundUserRoles = await useCase.execute(params);

        // Assert

        expect(foundUserRoles).toBeDefined();

        expect(foundUserRoles?.id).toEqual(1);
        expect(foundUserRoles?.userId).toEqual(2);
        expect(foundUserRoles?.admin).toBeFalsy();
        expect(foundUserRoles?.teacher).toBeFalsy();
        expect(foundUserRoles?.student).toBeTruthy();

        expect(userRolesRepository.updateByUserId).toHaveBeenCalledWith(2, false, false, true);
    });

    test('Should not update the roles for an user successfully due to teacher and student roles set simultaneously when use case is executed', async () => {
        // Prepare

        const params = new UpdateUserRolesByUserIdUseCaseParams(1, 2, false, true, true);

        // Act

        await expect(useCase.execute(params)).rejects.toThrow('An user can\'t have both teacher and student roles.');
    });

    test('Should not update the roles for an user successfully due auto removal of admin role when use case is executed', async () => {
        // Prepare

        currentUserRoles.userId = 1
        currentUserRoles.admin = true;
        currentUserRoles.teacher = false;
        currentUserRoles.student = false;

        const params = new UpdateUserRolesByUserIdUseCaseParams(1, 1, false, false, true);

        // Act

        await expect(useCase.execute(params)).rejects.toThrow('The current user can\'t remove its own admin role.');
    });
});