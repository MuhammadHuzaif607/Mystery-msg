import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { Message } from '@/model/User';
import messageSchema from '@/Schema/messageSchema';
import { z } from 'zod';

const messageQuerySchema = z.object({
  content: messageSchema,
});

export async function POST(req: Request) {
  dbConnect();
  try {
    const { username, content } = await req.json();

    const result = messageQuerySchema.safeParse({ content });

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        {
          status: 403,
        }
      );
    } else if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: 'User is not Accepting messages',
        },
        {
          status: 400,
        }
      );
    } else if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.issues[0].message,
        },
        {
          status: 403,
        }
      );
    }
    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: 'Successfully sent message',
        isAcceptingMessage:user.isAcceptingMessage
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err, 'Failed To send message');
    return Response.json(
      {
        success: false,
        message: 'Failed to sent messsage',
      },
      {
        status: 500,
      }
    );
  }
}
