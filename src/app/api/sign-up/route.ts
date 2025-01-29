import dbConnect from "@/lib/dbConnect.ts";
import UserModel from "@/model/User.model.ts";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail.ts";
//import { resend } from "@/lib/resend";
export async function POST(req: Request) {
  await dbConnect();

  try {
    const reqBody = await req.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return new Response(
        JSON.stringify({ success: false, message: "User already exists" }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Email already exists. Please login with another email.",
          }),
          { status: 400 }
        );
      } else {
        // Update the existing user's data
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(
          Date.now() + 60 * 60 * 1000
        ); // 1 hour expiry
        await existingUserByEmail.save();
      }
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }
    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: 500 }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message:
          "User registered successfully. Please check your email to verify your account.",
      }),
      { status: 200 } // Use the correct status code
    );
  } catch (error) {
    console.error("Error registering user", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error registering user",
      }),
      { status: 500 }
    );
  }
}
