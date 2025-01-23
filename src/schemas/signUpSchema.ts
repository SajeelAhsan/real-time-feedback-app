import {z} from 'zod'
export const usernameValidation = z
  .string()
  .min(5, "Username must be atleast 5 characters")
  .max(20,"Usernme must be no more than 20 characters")
  .ragex(/?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/, "Username must not contain special characters");


 export const signUpSchema = z.object({
  username:usernameValidation,
  email:z.string().email({message:'Invalid email address'}),
  password:z.string().min(8, {message:'password must be at least 6 characters'})
 })
