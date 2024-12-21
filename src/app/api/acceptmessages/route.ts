import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { getServerSession } from 'next-auth';
import { authoption } from '../auth/[...nextauth]/options';
import { User } from 'next-auth';

// Update isAccepting Message value
export async function POST(req: Request) {
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

  const userId = user._id;

  const { acceptMessages } = await req.json();
  try {
    const updateduser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updateduser) {
      return Response.json(
        {
          success: false,
          message: 'Failed to update user status to accept messages',
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updateduser,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log('Failed to update user status', err);
    return Response.json(
      {
        success: false,
        message: 'Failed to uodate user status',
      },
      {
        status: 500,
      }
    );
  }
}

// Get isAccepting Message value
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

  const userId = user._id;
  try {
    const newUser = await UserModel.findById(userId);

    if (!newUser) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        {
          status: 405,
        }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: newUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log('Server Error', err);
    return Response.json(
      {
        success: false,
        message: 'Error is getting message acceptance status',
      },
      {
        status: 500,
      }
    );
  }
}
