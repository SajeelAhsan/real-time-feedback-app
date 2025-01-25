import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not Authenticated User",
      }),
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "failed to update user status to accept messages",
        }),
        { status: 401 }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message Acceptance status updated successfully!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages");
    return new Response(
      JSON.stringify({
        success: false,
        message: "failed to update user status to accept messages",
      }),
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not Authenticated User",
      }),
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found!",
        }),
        { status: 404 }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in getting message acceptance status!");
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error in getting message acceptance status!",
      }),
      { status: 500 }
    );
  }
}
