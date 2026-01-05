import {describe} from "node:test";
import {DeepMockProxy, mockDeep, MockProxy} from "jest-mock-extended/lib/Mock";
import {User} from "../../../src/domain/vo/user/User";
import {mock, mockReset} from "jest-mock-extended";
import {UserRepositoryImpl} from "../../../src/data/repository/UserRepositoryImpl";
import {UserDAO} from "../../../src/data/dao/UserDAO";
import {UserMapper} from "../../../src/data/mapper/UserMapper";
import {UserRolesMapper} from "../../../src/data/mapper/UserRolesMapper";
import {UserEntity} from "../../../src/data/entity/UserEntity";
import {EntityManager, FindOneOptions, SelectQueryBuilder, UpdateQueryBuilder} from "typeorm";
import {UserRoles} from "../../../src/domain/vo/user/UserRoles";
import {UserRolesEntity} from "../../../src/data/entity/UserRolesEntity";
import {FindParams} from "../../../src/domain/vo/common/FindParams";
import {FindUsersSortField} from "../../../src/domain/vo/common/FindUsersSortField";
import {SortOrder} from "../../../src/domain/vo/common/SortOrder";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {PostEntity} from "../../../src/data/entity/PostEntity";

describe('UserRepositoryImpl class tests', () => {
    let userDAO: DeepMockProxy<UserDAO>;
    let userMapper: MockProxy<UserMapper>;
    let userRolesMapper: MockProxy<UserRolesMapper>;
    let entityManager: MockProxy<EntityManager>;
    let userSelectQueryBuilder: MockProxy<SelectQueryBuilder<UserEntity>>;
    let selectQueryBuilder: MockProxy<SelectQueryBuilder<UserEntity>>;
    let updateQueryBuilder: MockProxy<UpdateQueryBuilder<UserEntity>>;

    let repository: UserRepositoryImpl;

    beforeEach(() => {
        userDAO = mockDeep<UserDAO>();
        userMapper = mock<UserMapper>();
        userRolesMapper = mock<UserRolesMapper>();
        entityManager = mock<EntityManager>();
        userSelectQueryBuilder = mock<SelectQueryBuilder<UserEntity>>();
        selectQueryBuilder = mock<SelectQueryBuilder<UserEntity>>();
        updateQueryBuilder = mock<UpdateQueryBuilder<UserEntity>>();

        userDAO.createQueryBuilder.calledWith('user').mockReturnValue(selectQueryBuilder);
        userDAO.createQueryBuilder.calledWith().mockReturnValue(selectQueryBuilder);

        selectQueryBuilder.select.mockReturnValue(selectQueryBuilder);
        selectQueryBuilder.update.mockReturnValue(updateQueryBuilder);
        selectQueryBuilder.innerJoin.mockReturnValue(selectQueryBuilder)
        selectQueryBuilder.addOrderBy.mockReturnValue(selectQueryBuilder);
        selectQueryBuilder.orderBy.mockReturnValue(selectQueryBuilder);
        selectQueryBuilder.distinct.mockReturnValue(selectQueryBuilder);
        selectQueryBuilder.take.mockReturnValue(selectQueryBuilder);
        selectQueryBuilder.skip.mockReturnValue(selectQueryBuilder);

        updateQueryBuilder.set.mockReturnValue(updateQueryBuilder);
        updateQueryBuilder.where.mockReturnValue(updateQueryBuilder);

        repository = new UserRepositoryImpl(userDAO, userMapper, userRolesMapper);
    });

    afterEach(() => {
        mockReset(userDAO);
        mockReset(userMapper);
        mockReset(userRolesMapper);
        mockReset(entityManager);
        mockReset(userSelectQueryBuilder);
        mockReset(selectQueryBuilder);
        mockReset(updateQueryBuilder);

        jest.restoreAllMocks();
    })

    test('Should create an admin user successfully when create method is executed', async () => {
        // Arrange

        const user = new User(
            0,
            'username',
            'User',
            'user@email.com',
            'teste123',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const userEntity = new UserEntity(
            0,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const newUserEntity = new UserEntity(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const createdUser = new User(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const userRoles = new UserRoles(
            0,
            0,
            true,
            false,
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const userRolesEntity = new UserRolesEntity(
            0,
            0,
            true,
            false,
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const newUserRolesEntity = new UserRolesEntity(
            1,
            1,
            true,
            false,
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        userMapper.toUserEntity.calledWith(user).mockReturnValue(userEntity);

        userRolesMapper.toUserRolesEntity.calledWith(userRoles).mockReturnValue(userRolesEntity);

        // @ts-ignore
        entityManager.save.calledWith(userEntity).mockReturnValue(Promise.resolve(newUserEntity));
        // @ts-ignore
        entityManager.save.calledWith(userRolesEntity).mockReturnValue(Promise.resolve(newUserRolesEntity));

        userMapper.fromUserEntity.calledWith(newUserEntity).mockReturnValue(createdUser);

        // Act
        const newUserPromise = repository.create(user, userRoles);

        const transactionFunction = userDAO.manager.transaction.mock.calls[0][0];

        // @ts-ignore
        await transactionFunction(entityManager);

        await newUserPromise;

        expect(userMapper.toUserEntity).toHaveBeenCalledWith(user);
        expect(userRolesMapper.toUserRolesEntity).toHaveBeenCalledWith(userRoles);

        expect(userDAO.manager.transaction).toHaveBeenCalledWith(transactionFunction);

        expect(entityManager.save).toHaveBeenCalledWith(userEntity);
        expect(entityManager.save).toHaveBeenCalledWith(userRolesEntity);

        expect(userMapper.fromUserEntity).toHaveBeenCalledWith(newUserEntity);
    });

    test('Should retrieve an user successfully when getUserByUsername method is executed', async () => {
        // Arrange

        const userEntity = new UserEntity(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        userDAO.createQueryBuilder.calledWith('user').mockReturnValue(userSelectQueryBuilder);

        userSelectQueryBuilder.where.calledWith('LOWER(user.username) = LOWER(\'username\')')
            .mockReturnValue(userSelectQueryBuilder);

        userSelectQueryBuilder.getOne.mockReturnValue(Promise.resolve(userEntity));

        userMapper.fromUserEntity.calledWith(userEntity).mockReturnValue(user);

        // Act

        const existingUser = await repository.getByUsername('username');

        // Assert

        expect(existingUser).toEqual(user);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(userSelectQueryBuilder.where).toHaveBeenCalledWith('LOWER(user.username) = LOWER(\'username\')');
        expect(userSelectQueryBuilder.getOne).toHaveBeenCalled();
        expect(userMapper.fromUserEntity).toHaveBeenCalledWith(userEntity);
    });

    test('Should not retrieve an user successfully when getUserByUsername method is executed', async () => {
        // Arrange
        userDAO.createQueryBuilder.calledWith('user').mockReturnValue(userSelectQueryBuilder);

        userSelectQueryBuilder.where.calledWith('LOWER(user.username) = LOWER(\'username\')')
            .mockReturnValue(userSelectQueryBuilder);

        userSelectQueryBuilder.getOne.mockReturnValue(Promise.resolve(null));

        // Act

        const existingUser = await repository.getByUsername('username');

        // Assert

        expect(existingUser).toBeUndefined();

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(userSelectQueryBuilder.where).toHaveBeenCalledWith('LOWER(user.username) = LOWER(\'username\')');
        expect(userSelectQueryBuilder.getOne).toHaveBeenCalled();
    });

    test('Should retrieve an user successfully when getById method is executed', async () => {
        // Arrange

        const userEntity = new UserEntity(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        userDAO.findOne.mockReturnValue(Promise.resolve(userEntity));

        userMapper.fromUserEntity.calledWith(userEntity).mockReturnValue(user);

        // Act

        const existingUser = await repository.getById(1);

        // Assert

        expect(existingUser).toEqual(user);

        const options: FindOneOptions<UserEntity> = {
            where: {
                id: 1
            }
        }

        expect(userDAO.findOne).toHaveBeenCalledWith(options);
        expect(userMapper.fromUserEntity).toHaveBeenCalledWith(userEntity);
    });

    test('Should not retrieve an user successfully when getById method is executed', async () => {
        // Arrange

        userDAO.findOne.mockReturnValue(Promise.resolve(null));

        // Act

        const existingUser = await repository.getById(1);

        // Assert

        expect(existingUser).toBeUndefined();

        const options: FindOneOptions<UserEntity> = {
            where: {
                id: 1
            }
        }

        expect(userDAO.findOne).toHaveBeenCalledWith(options);
    });

    test('Should find users successfully when find method is executed without any parameter', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user2 = new User(
            2,
            'user2',
            'User 2',
            'user2@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user2Entity = new UserEntity(
            2,
            'user2',
            'User 2',
            'user2@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1, user2];

        const userEntities = [user1Entity, user2Entity];

        selectQueryBuilder.getManyAndCount.mockReturnValue(Promise.resolve([userEntities, userEntities.length]));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const result = await repository.find();

        // Assert

        expect(result.data).toEqual(users);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(users.length);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id');
        expect(selectQueryBuilder.take).toHaveBeenCalledWith(FindParams.DEFAULT_PAGE_SIZE);
        expect(selectQueryBuilder.skip).toHaveBeenCalledWith(0);
    });

    test('Should find users successfully when find method is executed with username parameter', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1];

        const userEntities = [user1Entity];

        selectQueryBuilder.getManyAndCount.mockReturnValue(Promise.resolve([userEntities, userEntities.length]));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const result = await repository.find('user1');

        // Assert

        expect(result.data).toEqual(users);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(users.length);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id');
        expect(selectQueryBuilder.take).toHaveBeenCalledWith(FindParams.DEFAULT_PAGE_SIZE);
        expect(selectQueryBuilder.skip).toHaveBeenCalledWith(0);
        expect(selectQueryBuilder.where).toHaveBeenCalledWith("user.username ILIKE '%user1%'", undefined);
    });

    test('Should find users successfully when find method is executed with name parameter', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1];

        const userEntities = [user1Entity];

        selectQueryBuilder.getManyAndCount.mockReturnValue(Promise.resolve([userEntities, userEntities.length]));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const result = await repository.find(undefined, 'User 1');

        // Assert

        expect(result.data).toEqual(users);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(users.length);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id');
        expect(selectQueryBuilder.take).toHaveBeenCalledWith(FindParams.DEFAULT_PAGE_SIZE);
        expect(selectQueryBuilder.skip).toHaveBeenCalledWith(0);
        expect(selectQueryBuilder.where).toHaveBeenCalledWith("user.name ILIKE '%User 1%'", undefined);
    });

    test('Should find users successfully when find method is executed with username and name parameter', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1];

        const userEntities = [user1Entity];

        selectQueryBuilder.getManyAndCount.mockReturnValue(Promise.resolve([userEntities, userEntities.length]));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const result = await repository.find('user1', 'User 1');

        // Assert

        expect(result.data).toEqual(users);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(users.length);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id');
        expect(selectQueryBuilder.take).toHaveBeenCalledWith(FindParams.DEFAULT_PAGE_SIZE);
        expect(selectQueryBuilder.skip).toHaveBeenCalledWith(0);
        expect(selectQueryBuilder.where).toHaveBeenCalledWith("user.username ILIKE '%user1%'", undefined);
        expect(selectQueryBuilder.andWhere).toHaveBeenCalledWith("user.name ILIKE '%User 1%'", undefined);
    });

    test('Should find users successfully when find method is executed with e-mail parameter', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1];

        const userEntities = [user1Entity];

        selectQueryBuilder.getManyAndCount.mockReturnValue(Promise.resolve([userEntities, userEntities.length]));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const result = await repository.find(undefined, undefined, 'user1@email.com');

        // Assert

        expect(result.data).toEqual(users);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(users.length);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id');
        expect(selectQueryBuilder.take).toHaveBeenCalledWith(FindParams.DEFAULT_PAGE_SIZE);
        expect(selectQueryBuilder.skip).toHaveBeenCalledWith(0);
        expect(selectQueryBuilder.where).toHaveBeenCalledWith("user.email ILIKE '%user1@email.com%'", undefined);
    });

    test('Should find users successfully when find method is executed with active flag parameter', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1];

        const userEntities = [user1Entity];

        selectQueryBuilder.getManyAndCount.mockReturnValue(Promise.resolve([userEntities, userEntities.length]));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const result = await repository.find(undefined, undefined, undefined, false);

        // Assert

        expect(result.data).toEqual(users);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(users.length);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id');
        expect(selectQueryBuilder.take).toHaveBeenCalledWith(FindParams.DEFAULT_PAGE_SIZE);
        expect(selectQueryBuilder.skip).toHaveBeenCalledWith(0);
        expect(selectQueryBuilder.where).toHaveBeenCalledWith("user.active=:active", {active: false});
    });

    test('Should find users successfully when find method is executed with admin role flag parameter', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1];

        const userEntities = [user1Entity];

        selectQueryBuilder.getManyAndCount.mockReturnValue(Promise.resolve([userEntities, userEntities.length]));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const result = await repository.find(undefined, undefined, undefined, undefined, true);

        // Assert

        expect(result.data).toEqual(users);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(users.length);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id');
        expect(selectQueryBuilder.take).toHaveBeenCalledWith(FindParams.DEFAULT_PAGE_SIZE);
        expect(selectQueryBuilder.skip).toHaveBeenCalledWith(0);
        expect(selectQueryBuilder.where).toHaveBeenCalledWith("userRoles.admin = :admin", {admin: true});
    });

    test('Should find users successfully when find method is executed with teacher role flag parameter', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1];

        const userEntities = [user1Entity];

        selectQueryBuilder.getManyAndCount.mockReturnValue(Promise.resolve([userEntities, userEntities.length]));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const result = await repository.find(undefined, undefined, undefined, undefined, undefined, true);

        // Assert

        expect(result.data).toEqual(users);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(users.length);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id');
        expect(selectQueryBuilder.take).toHaveBeenCalledWith(FindParams.DEFAULT_PAGE_SIZE);
        expect(selectQueryBuilder.skip).toHaveBeenCalledWith(0);
        expect(selectQueryBuilder.where).toHaveBeenCalledWith("userRoles.teacher = :teacher", {teacher: true});
    });

    test('Should find users successfully when find method is executed with student role flag parameter', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1];

        const userEntities = [user1Entity];

        selectQueryBuilder.getManyAndCount.mockReturnValue(Promise.resolve([userEntities, userEntities.length]));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const result = await repository.find(undefined, undefined, undefined, undefined, undefined, undefined, true);

        // Assert

        expect(result.data).toEqual(users);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(users.length);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id');
        expect(selectQueryBuilder.take).toHaveBeenCalledWith(FindParams.DEFAULT_PAGE_SIZE);
        expect(selectQueryBuilder.skip).toHaveBeenCalledWith(0);
        expect(selectQueryBuilder.where).toHaveBeenCalledWith("userRoles.student = :student", {student: true});
    });

    test('Should find users successfully when find method is executed with non-default find parameters', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1];

        const userEntities = [user1Entity];

        selectQueryBuilder.getManyAndCount.mockReturnValue(Promise.resolve([userEntities, userEntities.length]));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const findParams = new FindParams<FindUsersSortField>(FindUsersSortField.NAME, SortOrder.DESC, 1, 5);

        const result = await repository.find(undefined, undefined, undefined, undefined, undefined, undefined, undefined, findParams);

        // Assert

        expect(result.data).toEqual(users);
        expect(result.page).toEqual(findParams.page);
        expect(result.pageSize).toEqual(findParams.pageSize);
        expect(result.total).toEqual(users.length);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id');
        expect(selectQueryBuilder.take).toHaveBeenCalledWith(findParams.pageSize);
        expect(selectQueryBuilder.skip).toHaveBeenCalledWith(findParams.page * findParams.pageSize);
        expect(selectQueryBuilder.addOrderBy).toHaveBeenCalledWith(FindUsersSortField.NAME, SortOrder.DESC);
    });

    test('Should update an user successfully when update method is executed with name parameter', async () => {
        // Arrange

        const updatedUser = new User(
            1,
            'user1',
            'New User Name',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 1, 0, 0)
        );

        const userEntity = new UserEntity(
            1,
            'user1',
            'User',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const updatedUserEntity = new UserEntity(
            1,
            'user1',
            'New User Name',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 1, 0, 0)
        );

        userDAO.findOne.mockReturnValue(Promise.resolve(userEntity))
            .mockReturnValue(Promise.resolve(updatedUserEntity));

        userMapper.fromUserEntity.calledWith(updatedUserEntity).mockReturnValue(updatedUser);

        // Act

        const result = await repository.update(1, 'New User Name');

        // Assert

        expect(result).toEqual(updatedUser);

        const expectedUpdateParams: QueryDeepPartialEntity<UserEntity> = {
            name: 'New User Name'
        }

        expect(userDAO.findOne).toHaveBeenNthCalledWith(2, {where: {id: 1}});
        expect(userDAO.createQueryBuilder).toHaveBeenCalled();
        expect(selectQueryBuilder.update).toHaveBeenCalledWith(UserEntity);
        expect(updateQueryBuilder.set).toHaveBeenCalledWith(expectedUpdateParams);
        expect(updateQueryBuilder.where).toHaveBeenCalledWith('id = :id', {id: 1});
        expect(updateQueryBuilder.execute).toHaveBeenCalled();
    });

    test('Should update an user successfully when update method is executed with e-mail parameter', async () => {
        // Arrange

        const updatedUser = new User(
            1,
            'user1',
            'User',
            'newuser1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 1, 0, 0)
        );

        const userEntity = new UserEntity(
            1,
            'user1',
            'User',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const updatedUserEntity = new UserEntity(
            1,
            'user1',
            'User',
            'newuser1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 1, 0, 0)
        );

        userDAO.findOne.mockReturnValue(Promise.resolve(userEntity))
            .mockReturnValue(Promise.resolve(updatedUserEntity));

        userMapper.fromUserEntity.calledWith(updatedUserEntity).mockReturnValue(updatedUser);

        // Act

        const result = await repository.update(1, undefined, 'newuser1@email.com');

        // Assert

        expect(result).toEqual(updatedUser);

        const expectedUpdateParams: QueryDeepPartialEntity<UserEntity> = {
            email: 'newuser1@email.com'
        }

        expect(userDAO.findOne).toHaveBeenNthCalledWith(2, {where: {id: 1}});
        expect(userDAO.createQueryBuilder).toHaveBeenCalled();
        expect(selectQueryBuilder.update).toHaveBeenCalledWith(UserEntity);
        expect(updateQueryBuilder.set).toHaveBeenCalledWith(expectedUpdateParams);
        expect(updateQueryBuilder.where).toHaveBeenCalledWith('id = :id', {id: 1});
        expect(updateQueryBuilder.execute).toHaveBeenCalled();
    });

    test('Should update an user successfully when update method is executed with active flag parameter', async () => {
        // Arrange

        const updatedUser = new User(
            1,
            'user1',
            'User',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 1, 0, 0)
        );

        const userEntity = new UserEntity(
            1,
            'user1',
            'User',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const updatedUserEntity = new UserEntity(
            1,
            'user1',
            'User',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 1, 0, 0)
        );

        userDAO.findOne.mockReturnValue(Promise.resolve(userEntity))
            .mockReturnValue(Promise.resolve(updatedUserEntity));

        userMapper.fromUserEntity.calledWith(updatedUserEntity).mockReturnValue(updatedUser);

        // Act

        const result = await repository.update(1, undefined, undefined, false);

        // Assert

        expect(result).toEqual(updatedUser);

        const expectedUpdateParams: QueryDeepPartialEntity<UserEntity> = {
            active: false
        }

        expect(userDAO.findOne).toHaveBeenNthCalledWith(2, {where: {id: 1}});
        expect(userDAO.createQueryBuilder).toHaveBeenCalled();
        expect(selectQueryBuilder.update).toHaveBeenCalledWith(UserEntity);
        expect(updateQueryBuilder.set).toHaveBeenCalledWith(expectedUpdateParams);
        expect(updateQueryBuilder.where).toHaveBeenCalledWith('id = :id', {id: 1});
        expect(updateQueryBuilder.execute).toHaveBeenCalled();
    });

    test('Should not update an user successfully due to invalid user id when update method is executed', async () => {
        // Arrange

        userDAO.findOne.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.update(1, 'Name');

        // Assert

        expect(result).toBeUndefined();

        expect(userDAO.findOne).toHaveBeenCalledWith({where: {id: 1}});
    });

    test('Should retrieve users who created posts successfully getWithPosts method is executed', async () => {
        // Arrange

        const user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user2 = new User(
            2,
            'user2',
            'User 2',
            'user2@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const user2Entity = new UserEntity(
            2,
            'user2',
            'User 2',
            'user2@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const users = [user1, user2];

        const userEntities = [user1Entity, user2Entity];

        selectQueryBuilder.getMany.mockReturnValue(Promise.resolve(userEntities));

        userMapper.fromUserEntities.calledWith(userEntities).mockReturnValue(users);

        // Act

        const result = await repository.getWithPosts();

        // Assert

        expect(result).toEqual(users);

        expect(userDAO.createQueryBuilder).toHaveBeenCalledWith('user');
        expect(selectQueryBuilder.select).toHaveBeenCalled();
        expect(selectQueryBuilder.innerJoin).toHaveBeenCalledWith(PostEntity, 'post', 'post.user_id = user.id');
        expect(selectQueryBuilder.orderBy).toHaveBeenCalledWith('user.name', 'ASC');
        expect(selectQueryBuilder.distinct).toHaveBeenCalled();
        expect(selectQueryBuilder.getMany).toHaveBeenCalled();

        expect(userMapper.fromUserEntities).toHaveBeenCalledWith(userEntities);
    });

    test('Should change an user\' password successfully when changePassword method is executed', async () => {
        // Arrange

        const updatedUser = new User(
            1,
            'user1',
            'User',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 1, 0, 0)
        );

        const userEntity = new UserEntity(
            1,
            'user1',
            'User',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const updatedUserEntity = new UserEntity(
            1,
            'user1',
            'User',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            false,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 1, 0, 0)
        );

        userDAO.findOne.mockReturnValue(Promise.resolve(userEntity))
            .mockReturnValue(Promise.resolve(updatedUserEntity));

        userMapper.fromUserEntity.calledWith(updatedUserEntity).mockReturnValue(updatedUser);

        // Act

        const result = await repository.changePassword(1, 'new password');

        // Assert

        expect(result).toEqual(updatedUser);

        const expectedUpdateParams: QueryDeepPartialEntity<UserEntity> = {
            password: 'new password'
        }

        expect(userDAO.findOne).toHaveBeenNthCalledWith(2, {where: {id: 1}});
        expect(userDAO.createQueryBuilder).toHaveBeenCalled();
        expect(selectQueryBuilder.update).toHaveBeenCalledWith(UserEntity);
        expect(updateQueryBuilder.set).toHaveBeenCalledWith(expectedUpdateParams);
        expect(updateQueryBuilder.where).toHaveBeenCalledWith('id = :id', {id: 1});
        expect(updateQueryBuilder.execute).toHaveBeenCalled();
    });

    test('Should not change an user\' password successfully due to invalid user id when changePassword method is executed', async () => {
        // Arrange

        userDAO.findOne.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.changePassword(1, 'new password');

        // Assert

        expect(result).toBeUndefined();

        expect(userDAO.findOne).toHaveBeenCalledWith({where: {id: 1}});
    });
});