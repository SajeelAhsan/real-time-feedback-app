import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, verifyCode } = await req.json();
    console.log("Received request data:", { username, verifyCode });

    const decodedUsername = decodeURIComponent(username);
    console.log("Decoded username:", decodedUsername);

    const user = await UserModel.findOne({ username: decodedUsername });
    console.log("User found:", user);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    console.log("Stored verifyCode:", user.verifyCode);
    console.log("Stored verifyCodeExpiry:", user.verifyCodeExpiry);
    console.log("Received verifyCode:", verifyCode);
    console.log("Code validity:", isCodeValid);
    console.log("Code expiration check:", isCodeNotExpired);

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return new Response(
        JSON.stringify({
          success: true,
          message: "Account Verified Successfully.",
        }),
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        }),
        { status: 400 }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Your verification code is invalid. Please try with another code.",
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error verifying user",
      }),
      { status: 500 }
    );
  }
}

