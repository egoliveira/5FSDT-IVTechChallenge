import {UserRolesRepository} from "../../domain/repository/UserRolesRepository";
import {UserRoles} from "../../domain/vo/user/UserRoles";
import {Logger} from "tslog";
import {UserRolesMapper} from "../mapper/UserRolesMapper";
import {UserRolesDAO} from "../dao/UserRolesDAO";
import {StudentEntity} from "../entity/StudentEntity";
import {StudentDAO} from "../dao/StudentDAO";
import {UserEntity} from "../entity/UserEntity";

export class UserRolesRepositoryImpl implements UserRolesRepository {
    private readonly logger: Logger<any>;

    constructor(
        private readonly userRolesDAO: UserRolesDAO,
        private readonly studentDAO: StudentDAO,
        private readonly userRolesMapper: UserRolesMapper) {
        this.logger = new Logger({name: 'UserRolesRepositoryImpl'});
    }

    async getByUserId(userId: number): Promise<UserRoles | undefined> {
        this.logger.debug(`Retrieving user roles by user id ${userId}...`);

        const userRolesEntity = await this.userRolesDAO.findOne({
            where: {
                userId: userId
            }
        });

        let userRoles: UserRoles | undefined = undefined;

        if (userRolesEntity) {
            userRoles = this.userRolesMapper.fromUserRolesEntity(userRolesEntity);

            this.logger.debug(`User roles for user id ${userId} retrieved.`);
        } else {
            this.logger.error(`Can't find user roles for user id ${userId}.`);
        }

        return userRoles;
    }

    async updateByUserId(userId: number, admin: boolean, teacher: boolean, student: boolean): Promise<UserRoles | undefined> {
        this.logger.debug(`Updating roles for user id ${userId} (admin: ${admin}, teacher: ${teacher}, student: ${student})...`);

        let userRoles: UserRoles | undefined = undefined;

        const userRolesEntity = await this.userRolesDAO.findOne({
            where: {
                userId: userId
            }
        });

        if (userRolesEntity) {
            const createStudent = student && !userRolesEntity.student;
            const deleteStudent = !student && userRolesEntity.student;

            userRolesEntity.admin = admin;
            userRolesEntity.teacher = teacher;
            userRolesEntity.student = student;

            await this.userRolesDAO.manager.transaction(async manager => {
                const updatedUserRoles = await manager.save(userRolesEntity);

                if (createStudent) {
                    const student = new StudentEntity(undefined, userId, new UserEntity(userId));

                    await manager.save(student);
                } else if (deleteStudent) {
                    const student = await this.studentDAO.findOne({
                        where: {
                            userId: userId
                        }
                    });

                    if (student) {
                        await manager.remove(student);
                    }
                }

                userRoles = this.userRolesMapper.fromUserRolesEntity(updatedUserRoles);

                this.logger.debug(`User roles for user id ${userId} updated successfully.`);
            });
        } else {
            this.logger.warn(`Can't find user roles for user id ${userId}.`);
        }

        return userRoles;
    }
}