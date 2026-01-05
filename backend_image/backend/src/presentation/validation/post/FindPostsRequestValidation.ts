import * as z from "zod";
import {FindRequestValidation} from "../general/FindRequestValidation";
import {FindPostsSortField} from "../../../domain/vo/common/FindPostsSortField";

export const FindPostsRequestValidation = z.object({
    fullContent: z.string().trim().min(2).max(512).optional(),
    subjectId: z.coerce.number().min(1).optional(),
    teachingLevelId: z.coerce.number().min(1).optional(),
    teachingGradeId: z.coerce.number().min(1).optional(),
    userId: z.coerce.number().min(1).optional(),
    sortBy: z.enum([FindPostsSortField.TITLE, FindPostsSortField.SUBJECT, FindPostsSortField.TEACHER, FindPostsSortField.TEACHING_GRADE]).optional(),
}).merge(FindRequestValidation);