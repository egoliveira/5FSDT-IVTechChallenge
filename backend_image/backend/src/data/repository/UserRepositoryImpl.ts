import {UserRepository} from "../../domain/repository/UserRepository";
import {User} from "../../domain/vo/user/User";
import {UserDAO} from "../dao/UserDAO";
import {UserMapper} from "../mapper/UserMapper";
import {UserRoles} from "../../domain/vo/user/UserRoles";
import {UserRolesMapper} from "../mapper/UserRolesMapper";
import {Logger} from "tslog";
import {ObjectLiteral, SelectQueryBuilder} from "typeorm";
import {DataPage} from "../../domain/vo/common/DataPage";
import {FindParams} from "../../domain/vo/common/FindParams";
import {UserEntity} from "../entity/UserEntity";
import {FindUsersSortField} from "../../domain/vo/common/FindUsersSortField";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {UserRolesEntity} from "../entity/UserRolesEntity";
import {StudentEntity} from "../entity/StudentEntity";
import {PostEntity} from "../entity/PostEntity";

export class UserRepositoryImpl implements UserRepository {
    private readonly logger: Logger<any>;

    constructor(
        private readonly userDAO: UserDAO,
        private readonly userMapper: UserMapper,
        private readonly userRolesMapper: UserRolesMapper) {
        this.logger = new Logger({name: 'UserRepositoryImpl'});
    }

    async create(user: User, userRoles: UserRoles): Promise<User> {
        this.logger.debug(`Creating user ${user.username} (admin: ${userRoles.admin}, teacher: ${userRoles.teacher}, student: ${userRoles.student}, teacher: ${userRoles.teacher})...`);

        const userEntity = this.userMapper.toUserEntity(user);
        const userRolesEntity = this.userRolesMapper.toUserRolesEntity(userRoles);

        return await this.userDAO.manager.transaction(async manager => {
            const realUserEntity = await manager.save(userEntity);

            userRolesEntity.userId = realUserEntity.id;

            await manager.save(userRolesEntity);

            if (userRoles.student) {
                const studentEntity = new StudentEntity(undefined, realUserEntity.id, new UserEntity(realUserEntity.id));

                await manager.save(studentEntity);
            }

            this.logger.debug(`User ${user.username} created successfully.`);

            return this.userMapper.fromUserEntity(realUserEntity);
        });
    }

    async getByUsername(username: string): Promise<User | undefined> {
        this.logger.debug(`Retrieving user by username ${username}...`);

        const userEntity = await this.userDAO.createQueryBuilder('user')
            .where(`LOWER(user.username) = LOWER('${username}')`).getOne();

        let user: User | undefined;

        if (userEntity) {
            user = this.userMapper.fromUserEntity(userEntity);

            this.logger.debug(`User ${username} retrieved successfully.`);
        } else {
            this.logger.debug(`User ${username} not found.`);
        }

        return user;
    }

    async getById(id: number): Promise<User | undefined> {
        this.logger.debug(`Retrieving user by id ${id}...`);

        const userEntity = await this.userDAO.findOne({
            where: {
                id: id
            }
        });

        let user: User | undefined;

        if (userEntity) {
            user = this.userMapper.fromUserEntity(userEntity);

            this.logger.debug(`User ${id} retrieved successfully.`);
        } else {
            this.logger.debug(`User ${id} not found.`);
        }

        return user;
    }

    async find(username?: string, name?: string, email?: string, active?: boolean, admin?: boolean, teacher?: boolean,
               student?: boolean, findParams?: FindParams<FindUsersSortField>): Promise<DataPage<User>> {
        this.logger.debug(`Finding users by parameters (username: ${username}, name: ${name}, email: ${email}, 
        active: ${active}, admin: ${admin}, teacher: ${teacher}, student: ${student}, pageSize: ${findParams?.pageSize}, 
        page: ${findParams?.page}, sortBy: ${findParams?.sortBy}, sortOrder: ${findParams?.sortOrder})...`);

        const pageSize = findParams?.pageSize || FindParams.DEFAULT_PAGE_SIZE;
        const page = findParams?.page || 0;

        const queryBuilder = this.userDAO.createQueryBuilder('user')
            .select('user')
            .innerJoin(UserRolesEntity, 'userRoles', 'userRoles.user_id = user.id')
            .take(pageSize).skip(pageSize * page);

        let whereCount = 0;

        if (admin !== undefined) {
            whereCount = this.addWhere(queryBuilder, whereCount, 'userRoles.admin = :admin', {admin: admin});
        }

        if (teacher !== undefined) {
            whereCount = this.addWhere(queryBuilder, whereCount, 'userRoles.teacher = :teacher', {teacher: teacher});
        }

        if (student !== undefined) {
            whereCount = this.addWhere(queryBuilder, whereCount, 'userRoles.student = :student', {student: student});
        }

        if (username) {
            whereCount = this.addWhere(queryBuilder, whereCount, `user.username ILIKE '%${username}%'`);
        }

        if (name) {
            whereCount = this.addWhere(queryBuilder, whereCount, `user.name ILIKE '%${name}%'`);
        }

        if (email) {
            whereCount = this.addWhere(queryBuilder, whereCount, `user.email ILIKE '%${email}%'`);
        }

        if (active !== undefined) {
            this.addWhere(queryBuilder, whereCount, `user.active=:active`, {active: active});
        }

        if (findParams && findParams.sortBy && findParams.sortOrder) {
            queryBuilder.addOrderBy(`user.${findParams.sortBy}`, findParams.sortOrder);
        }

        const [userEntities, count] = await queryBuilder.getManyAndCount();
        const users = this.userMapper.fromUserEntities(userEntities);

        this.logger.debug(`Total of users found: ${users.length}.`);

        return new DataPage<User>(users, page, pageSize, count);
    }

    async update(id: number, name?: string, email?: string, active?: boolean): Promise<User | undefined> {
        let updatedUser: User | undefined = undefined;

        this.logger.debug(`Updating user id ${id}...`);

        const currentUserEntity = await this.userDAO.findOne({
            where: {
                id: id
            }
        });

        if (currentUserEntity) {
            const params: QueryDeepPartialEntity<UserEntity> = {}

            if (name) {
                params.name = name;
            }

            if (email) {
                params.email = email;
            }

            if (active !== undefined) {
                params.active = active;
            }

            await this.userDAO.createQueryBuilder()
                .update(UserEntity)
                .set(params)
                .where('id = :id', {id: id})
                .execute();

            const updatedUserEntity = await this.userDAO.findOne({
                where: {
                    id: id
                }
            });

            if (updatedUserEntity) {
                updatedUser = this.userMapper.fromUserEntity(updatedUserEntity);
            }
        } else {
            this.logger.warn(`User ${id} not found. Can't update it.`);
        }

        return updatedUser;
    }

    async getWithPosts(): Promise<User[]> {
        this.logger.debug(`Retrieving users that created posts...`);

        const userEntities = await this.userDAO.createQueryBuilder('user')
            .select()
            .innerJoin(PostEntity, 'post', 'post.user_id = user.id')
            .orderBy('user.name', 'ASC')
            .distinct()
            .getMany();

        const users = this.userMapper.fromUserEntities(userEntities);

        this.logger.debug(`Number of users with posts: ${users.length}`);

        return users;
    }

    async changePassword(id: number, password: string): Promise<User | undefined> {
        let updatedUser: User | undefined = undefined;

        this.logger.debug(`Change password of user id ${id}...`);

        const currentUserEntity = await this.userDAO.findOne({
            where: {
                id: id
            }
        });

        if (currentUserEntity) {
            const params: QueryDeepPartialEntity<UserEntity> = {}

            params.password = password;

            await this.userDAO.createQueryBuilder()
                .update(UserEntity)
                .set(params)
                .where('id = :id', {id: id})
                .execute();

            const updatedUserEntity = await this.userDAO.findOne({
                where: {
                    id: id
                }
            });

            if (updatedUserEntity) {
                updatedUser = this.userMapper.fromUserEntity(updatedUserEntity);
            }
        } else {
            this.logger.warn(`User ${id} not found. Can't change his password.`);
        }

        return updatedUser;
    }

    private addWhere(queryBuilder: SelectQueryBuilder<UserEntity>, whereClauseCount: number, whereClause: string, parameters?: ObjectLiteral): number {
        if (whereClauseCount == 0) {
            queryBuilder.where(whereClause, parameters);
        } else {
            queryBuilder.andWhere(whereClause, parameters);
        }

        return whereClauseCount + 1;
    }
}