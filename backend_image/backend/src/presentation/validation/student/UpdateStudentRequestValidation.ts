import * as z from "zod";

export const UpdateStudentRequestValidation = z.object({
    teachingGradeId: z.coerce.number().min(1),
});