import {z} from 'zod';

export const usernameValidation = z
.string()
.min(2,'Username must be atleast more than 2 characters')
.max(30,'Username must not be more than 30 characters')
.regex(/^[a-zA-Z0-9_]+$/,'Username must not contain special characters')


export const signUpSchema = z.object({
    username:usernameValidation,
    email: z.string().email(),
    password:z.string()
    .min(6,{message:"Password must be less than 6 characters"})
})