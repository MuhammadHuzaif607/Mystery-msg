import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/Schema/signupSchema';

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryparam = {
      username: searchParams.get('username'),
    };
    // Validate with zod

    const result = usernameQuerySchema.safeParse(queryparam);

    if (!result.success) {
      const usernameerrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameerrors.length > 0
              ? usernameerrors.join(',')
              : 'Invalid Query parameters',
        },
        {
          status: 400,
        }
      );
    }

    const usernameUnique = await UserModel.findOne({
      username: queryparam.username,
      isVerified: true,
    });

    if (usernameUnique) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error('Error checking username', err);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      {
        status: 500,
      }
    );
  }
}
