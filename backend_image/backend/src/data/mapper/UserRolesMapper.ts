import {injectable} from "tsyringe";
import {UserRoles} from "../../domain/vo/user/UserRoles";
import {UserRolesEntity} from "../entity/UserRolesEntity";

@injectable()
export class UserRolesMapper {
    toUserRolesEntity(userRoles: UserRoles): UserRolesEntity {
        return new UserRolesEntity(
            userRoles.id,
            userRoles.userId,
            userRoles.admin,
            userRoles.teacher,
            userRoles.student,
            userRoles.createdAt,
            userRoles.updatedAt
        );
    }

    fromUserRolesEntity(userRolesEntity: UserRolesEntity): UserRoles {
        return new UserRoles(
            userRolesEntity.id,
            userRolesEntity.userId,
            userRolesEntity.admin,
            userRolesEntity.teacher,
            userRolesEntity.student,
            userRolesEntity.createdAt,
            userRolesEntity.updatedAt
        );
    }
}