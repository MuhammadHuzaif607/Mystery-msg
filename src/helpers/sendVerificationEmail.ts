import resend from '@/lib/resend';
import VerificationEmail from '../../emails/verificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export default async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Verification Email',
      react: VerificationEmail({ username, verificationLink: verifyCode }),
    });

    return {
      success: true,
      message: 'Successfully sent verification Email',
    };
  } catch (err) {
    console.error('error sending verification email', err);
    return {
      success: false,
      message: 'Failed to send verification Email',
    };
  }
}
