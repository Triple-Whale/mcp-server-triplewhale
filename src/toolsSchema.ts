import {z} from "zod";


export const mobyInputSchema = z.object({
    question: z.string().describe('A question about e-commerce data like spend'),
    shopId: z.string().describe('shopId that is used to fetch data'),
});
