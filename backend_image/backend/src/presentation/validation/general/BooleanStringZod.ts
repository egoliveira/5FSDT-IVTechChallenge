import * as z from "zod";

export const BooleanStringZod = z.union([
    z.literal('true').transform(() => true),
    z.literal('false').transform(() => false),
    z.boolean(),
]);