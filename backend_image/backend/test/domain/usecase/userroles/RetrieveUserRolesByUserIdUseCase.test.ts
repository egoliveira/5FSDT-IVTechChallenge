import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {
    RetrieveUserRolesByUserIdUseCase
} from "../../../../src/domain/usecase/userroles/RetrieveUserRolesByUserIdUseCase";
import {UserRolesRepository} from "../../../../src/domain/repository/UserRolesRepository";
import {UserRoles} from "../../../../src/domain/vo/user/UserRoles";

describe('RetrieveUserRolesByUserIdUseCase class tests', () => {
    let userRolesRepository: MockProxy<UserRolesRepository>;
    let userRoles: UserRoles;
    let useCase: RetrieveUserRolesByUserIdUseCase;

    beforeEach(() => {
        userRolesRepository = mock<UserRolesRepository>()

        userRoles = new UserRoles(
            1, 1, false, true, false
        );

        userRolesRepository.getByUserId.calledWith(1).mockReturnValue(Promise.resolve(userRoles))

        useCase = new RetrieveUserRolesByUserIdUseCase(userRolesRepository);
    });

    afterEach(() => {
        mockReset(userRolesRepository);

        jest.restoreAllMocks();
    })

    test('Should retrieve the roles for an user successfully when use case is executed', async () => {
        // Act

        const foundUserRoles = await useCase.execute(1);

        // Assert

        expect(foundUserRoles).toBeDefined();

        expect(foundUserRoles?.id).toEqual(1);
        expect(foundUserRoles?.userId).toEqual(1);
        expect(foundUserRoles?.admin).toBeFalsy();
        expect(foundUserRoles?.teacher).toBeTruthy();
        expect(foundUserRoles?.student).toBeFalsy();

        expect(userRolesRepository.getByUserId).toHaveBeenCalledWith(1);
    });


    test('Should not retrieve the roles for an user successfully due to invalid user id when use case is executed', async () => {
        // Act

        const foundUserRoles = await useCase.execute(2);

        // Assert

        expect(foundUserRoles).toBeUndefined();
    });
});