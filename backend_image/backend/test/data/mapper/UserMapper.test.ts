import {describe} from "node:test";
import {UserMapper} from "../../../src/data/mapper/UserMapper";
import {User} from "../../../src/domain/vo/user/User";
import {UserEntity} from "../../../src/data/entity/UserEntity";

describe('UserMapper class tests', () => {
    let mapper: UserMapper;

    beforeEach(() => {
        mapper = new UserMapper();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    })

    test('Should map an user value object to an user entity successfully', () => {
        // Prepare

        const user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        // Act

        const result = mapper.toUserEntity(user);

        // Assert

        expect(result.id).toEqual(user.id);
        expect(result.username).toEqual(user.username);
        expect(result.name).toEqual(user.name);
        expect(result.email).toEqual(user.email);
        expect(result.password).toEqual(user.password);
        expect(result.active).toEqual(user.active);
        expect(result.createdAt).toEqual(user.createdAt);
        expect(result.updatedAt).toEqual(user.updatedAt);
    });

    test('Should map an user entity object to an user value object successfully', () => {
        // Prepare

        const user = new UserEntity(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        // Act

        const result = mapper.fromUserEntity(user);

        // Assert

        expect(result.id).toEqual(user.id);
        expect(result.username).toEqual(user.username);
        expect(result.name).toEqual(user.name);
        expect(result.email).toEqual(user.email);
        expect(result.password).toEqual(user.password);
        expect(result.active).toEqual(user.active);
        expect(result.createdAt).toEqual(user.createdAt);
        expect(result.updatedAt).toEqual(user.updatedAt);
    });

    test('Should map a list of user entity objects to a list of user value object list successfully', () => {
        // Prepare

        const user1 = new UserEntity(
            1,
            'username1',
            'User 1',
            'user1@email.com',
            'password1',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const user2 = new UserEntity(
            2,
            'username2',
            'User 2',
            'user2@email.com',
            'password2',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        // Act

        const result = mapper.fromUserEntities([user1, user2]);

        // Assert

        expect(result.length).toEqual(2);

        expect(result[0].id).toEqual(user1.id);
        expect(result[0].username).toEqual(user1.username);
        expect(result[0].name).toEqual(user1.name);
        expect(result[0].email).toEqual(user1.email);
        expect(result[0].password).toEqual(user1.password);
        expect(result[0].active).toEqual(user1.active);
        expect(result[0].createdAt).toEqual(user1.createdAt);
        expect(result[0].updatedAt).toEqual(user1.updatedAt);

        expect(result[1].id).toEqual(user2.id);
        expect(result[1].username).toEqual(user2.username);
        expect(result[1].name).toEqual(user2.name);
        expect(result[1].email).toEqual(user2.email);
        expect(result[1].password).toEqual(user2.password);
        expect(result[1].active).toEqual(user2.active);
        expect(result[1].createdAt).toEqual(user2.createdAt);
        expect(result[1].updatedAt).toEqual(user2.updatedAt);
    });
});