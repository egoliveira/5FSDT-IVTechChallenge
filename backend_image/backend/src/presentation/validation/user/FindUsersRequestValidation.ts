import * as z from "zod";
import {FindRequestValidation} from "../general/FindRequestValidation";
import {FindUsersSortField} from "../../../domain/vo/common/FindUsersSortField";
import {BooleanStringZod} from "../general/BooleanStringZod";
import {UserRoleFilter} from "../../vo/UserRoleFilter";

export const FindUsersRequestValidation = z.object({
    username: z.string().trim().min(2).max(100).optional(),
    name: z.string().trim().min(2).max(255).optional(),
    email: z.string().trim().min(2).max(255).optional(),
    active: BooleanStringZod.optional(),
    userRole: z.enum([UserRoleFilter.ADMIN, UserRoleFilter.TEACHER, UserRoleFilter.STUDENT]).optional(),
    sortBy: z.enum([FindUsersSortField.USERNAME, FindUsersSortField.NAME, FindUsersSortField.EMAIL, FindUsersSortField.ACTIVE]).optional(),
}).merge(FindRequestValidation);