import {z} from "zod";

const siginInSchema = z.object({
    email:z.string(),
    password:z.string()
})

export default siginInSchema;