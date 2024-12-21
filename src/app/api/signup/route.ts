import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import sendVerificationEmail from '@/helpers/sendVerificationEmail';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existinguserByVerifiedByUsername = await UserModel.findOne({
      username,
      verified: true,
    });

    if (existinguserByVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username already taken',
        },
        {
          status: 400,
        }
      );
    }
    const existinguserByVerifiedByEmail = await UserModel.findOne({
      email,
    });

    if (existinguserByVerifiedByEmail) {
      if (existinguserByVerifiedByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exist with this email',
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedpassword = await bcrypt.hash(password, 10);

        existinguserByVerifiedByEmail.password = hashedpassword;
        existinguserByVerifiedByEmail.verifyCode = verifyCode;
        existinguserByVerifiedByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );

        await existinguserByVerifiedByEmail.save();
      }
    } else {
      const hashedpassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedpassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
        isVerified: false,
      });

      await newUser.save();
    }

    // Send verification Email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (emailResponse.success) {
      return Response.json(
        {
          success: true,
          message: 'Verification Email sent to your email',
        },
        {
          status: 200,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }
  } catch (err) {
    console.error('Error registering user', err);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      {
        status: 500,
      }
    );
  }
}
