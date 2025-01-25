import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log("Sending email to:", email);
    console.log("Verification code:", verifyCode);

    const result = await resend.emails.send({
      from: "sajeelahsan786@gmail.com",
      to: email,
      subject: "real-time-feedback-app - Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log("Resend email result:", result);

    return { success: true, message: "Verification Email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
