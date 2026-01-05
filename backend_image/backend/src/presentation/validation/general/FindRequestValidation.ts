import * as z from "zod";
import {SortOrder} from "../../../domain/vo/common/SortOrder";

export const FindRequestValidation = z.object({
    page: z.coerce.number().min(0).optional(),
    pageSize: z.coerce.number().min(1).optional(),
    sortOrder: z.enum([SortOrder.ASC, SortOrder.DESC]).default(SortOrder.ASC)
});