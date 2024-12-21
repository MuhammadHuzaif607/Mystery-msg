import { z } from 'zod';

const isAcceptingMessageSchema = z.object({
  acceptMessage: z.boolean(),
});

export default isAcceptingMessageSchema;
