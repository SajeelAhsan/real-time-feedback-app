import dbConnect from "@/lib/dbConnect.ts";
import UserModel from "@/model/User.model.ts";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail.ts";
import { ApiResponse } from "@/types/ApiResponse.ts";

/**
 * Handles creating a new user
 * @param {Request} req - The request object
 * @returns {Response} - The response object
 * @throws {Error} - If the user already exists
 * @throws {Error} - If the user creation fails
 */
export async function POST(req: Request) {
  await dbConnect();

  try {
    const {username, email, password} = await request.json();

    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ sucess: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true })
    if (existingUserVerifiedByUsername) {
      return new Response(
        JSON.stringify({ sucess: false, message: "User already exists" }),
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({email})

    const verifyCode =Math.floor(Math.random() * 9000000).toString()

    if(existingUserByEmail){
      if(existingUserByEmail.isVerified){
        return Response.json({
          sucess: false,
          message: "Email alredy exists. Please login with another email."
        }, {
          status: 400
        })
      } else {
        const hasedPassword =await bcrypt.hash(password,10)
        existingUserByEmail.password = hasedPassword
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000)
        await existingUserByEmail.save()
      }
    }
    else{
      const hasedPassword =await bcrypt.hash(password,10)
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new userModel({
        username,
        email,
        password: hasedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: []
      })
      await newUser.save();
    }
    //send verification email
    cosnt emailResponse =await sendVerificationEmail(
      email,
      username,
      verifyCode
    )
    if(!emailResponse.success){
      return Response.json({
        sucess: false,
        message: emailResponse.message
      }, {
        status: 500
      })
    }
    return Response.json({
      sucess: true,
      message: "User registered Successfully. Please check your email to verify your account."
    }, {
      status: 500
    })
  } catch (error) {
    console.log("Error registrating user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    )
  }
}
