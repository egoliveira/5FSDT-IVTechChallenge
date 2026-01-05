import {CreateUserRequestUserRoles} from "../validation/user/CreateUserRequestValidation";
import {UserRoles} from "../../domain/vo/user/UserRoles";
import {injectable} from "tsyringe";

@injectable()
export class UserRolesMapper {
    fromZodObject(zodUserRoles: CreateUserRequestUserRoles): UserRoles {
        return new UserRoles(0, 0, zodUserRoles.admin, zodUserRoles.teacher, zodUserRoles.student);
    }
}
