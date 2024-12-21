import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { getServerSession } from 'next-auth';
import { authoption } from '../auth/[...nextauth]/options';
import { User } from 'next-auth';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  await dbConnect();

  const session = await getServerSession(authoption);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: 'User not logged in ',
      },
      {
        status: 400,
      }
    );
  }
  const messageID = params.messageid;
  try {
    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageID } } }
    );

    if (updatedUser.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Message already deleted or doesn't exist`,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message Deleted',
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error('Failed to delete messages', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Server Error',
      },
      {
        status: 500,
      }
    );
  }
}
