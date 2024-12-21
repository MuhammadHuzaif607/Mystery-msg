import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { getServerSession } from 'next-auth';
import { authoption } from '../auth/[...nextauth]/options';
import { User } from 'next-auth';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authoption);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: 'User not logged in ',
      },
      {
        status: 400,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]);

    if (!user || user.length == 0) {
      return Response.json(
        {
          success: false,
          message: 'Messages not found',
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: 'Successfully getting all messages',
        messages:user[0].messages
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error('Failed to get messages', err);
    return Response.json(
      {
        success: false,
        message: 'Error in getting messages',
      },
      {
        status: 500,
      }
    );
  }
}
