import * as z from "zod";
import {BooleanStringZod} from "../general/BooleanStringZod";

export const UpdateUserRolesRequestValidation = z.object({
    admin: BooleanStringZod,
    teacher: BooleanStringZod,
    student: BooleanStringZod
});