import {z} from 'zod';

const verifyCodeSChema = z.object({
    verifyCode:z.string().length(6,{message:"Code should be of 6 digits"})
})

export default verifyCodeSChema;