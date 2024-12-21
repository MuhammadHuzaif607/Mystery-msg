import { z } from 'zod';

const messageSchema = z
  .string()
  .min(10, { message: 'Message must be atleast 10 characters' })
  .max(30, { message: 'Message must not be more than 30 characters' })

export default messageSchema;
