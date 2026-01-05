import * as z from "zod";

export const CreatePostRequestValidation = z.object({
    title: z.string().trim().min(3).max(512),
    content: z.string().trim().min(3).max(32767),
    subjectId: z.coerce.number().min(1),
    teachingGradeId: z.coerce.number().min(1)
});