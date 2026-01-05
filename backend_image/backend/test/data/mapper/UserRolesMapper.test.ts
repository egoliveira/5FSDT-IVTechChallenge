import "reflect-metadata";
import {describe} from "node:test";
import {UserRolesMapper} from "../../../src/data/mapper/UserRolesMapper";
import {UserRoles} from "../../../src/domain/vo/user/UserRoles";
import {UserRolesEntity} from "../../../src/data/entity/UserRolesEntity";

describe('UserRolesMapper class tests', () => {
    let mapper: UserRolesMapper;

    beforeEach(() => {
        mapper = new UserRolesMapper();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    })

    test('Should map an user roles value object to an user roles entity successfully', () => {
        // Prepare

        const userRoles = new UserRoles(
            1,
            1,
            true,
            false,
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        // Act

        const result = mapper.toUserRolesEntity(userRoles);

        // Assert

        expect(result.id).toEqual(userRoles.id);
        expect(result.userId).toEqual(userRoles.userId);
        expect(result.admin).toEqual(userRoles.admin);
        expect(result.teacher).toEqual(userRoles.teacher);
        expect(result.student).toEqual(userRoles.student);
        expect(result.createdAt).toEqual(userRoles.createdAt);
        expect(result.updatedAt).toEqual(userRoles.updatedAt);
    });

    test('Should map an user roles entity object to an user roles value object successfully', () => {
        // Prepare

        const userRolesEntity = new UserRolesEntity(
            1,
            1,
            true,
            false,
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        // Act

        const result = mapper.fromUserRolesEntity(userRolesEntity);

        // Assert

        expect(result.id).toEqual(userRolesEntity.id);
        expect(result.userId).toEqual(userRolesEntity.userId);
        expect(result.admin).toEqual(userRolesEntity.admin);
        expect(result.teacher).toEqual(userRolesEntity.teacher);
        expect(result.student).toEqual(userRolesEntity.student);
        expect(result.createdAt).toEqual(userRolesEntity.createdAt);
        expect(result.updatedAt).toEqual(userRolesEntity.updatedAt);
    });
});