import * as z from "zod";
import {FindRequestValidation} from "../general/FindRequestValidation";
import {FindStudentsSortField} from "../../../domain/vo/common/FindStudentsSortField";

export const FindStudentsRequestValidation = z.object({
    name: z.string().trim().min(2).max(255).optional(),
    email: z.string().trim().min(2).max(255).optional(),
    teachingLevelId: z.coerce.number().min(1).optional(),
    teachingGradeId: z.coerce.number().min(1).optional(),
    sortBy: z.enum([FindStudentsSortField.NAME, FindStudentsSortField.EMAIL, FindStudentsSortField.TEACHING_LEVEL, FindStudentsSortField.TEACHING_GRADE]).optional(),
}).merge(FindRequestValidation);