import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, verifyCode } = await req.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'Username not found',
        },
        {
          status: 400,
        }
      );
    }

    const isVerified = user.verifyCode === verifyCode;

    const isNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isVerified && isNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: 'Account verified successfully',
        },
        {
          status: 200,
        }
      );
    } else if (!isVerified) {
      return Response.json(
        {
          success: false,
          message: 'Verification code Incorrect',
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: 'Time Expired,Please try again',
        },
        {
          status: 400,
        }
      );
    }
  } catch (err) {
    console.error('Error verifying username', err);
    return Response.json(
      {
        success: false,
        message: 'Error verifying username',
      },
      {
        status: 500,
      }
    );
  }
}