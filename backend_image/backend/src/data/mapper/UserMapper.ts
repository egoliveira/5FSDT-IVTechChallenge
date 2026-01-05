import {UserEntity} from "../entity/UserEntity";
import {User} from "../../domain/vo/user/User";
import {injectable} from "tsyringe";

@injectable()
export class UserMapper {
    toUserEntity(user: User): UserEntity {
        return new UserEntity(
            user.id,
            user.username,
            user.name,
            user.email,
            user.password,
            user.active,
            user.createdAt,
            user.updatedAt
        );
    }

    fromUserEntity(userEntity: UserEntity): User {
        return new User(
            userEntity.id,
            userEntity.username,
            userEntity.name,
            userEntity.email,
            userEntity.password,
            userEntity.active,
            userEntity.createdAt,
            userEntity.updatedAt
        );
    }

    fromUserEntities(userEntities: UserEntity[]): User[] {
        return userEntities.map((userEntity) => {
            return this.fromUserEntity(userEntity);
        });
    }
}