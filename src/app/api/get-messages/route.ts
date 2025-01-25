import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { mongoose } from "mongoose";

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
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user || user.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found!",
        }),
        { status: 401 }
      );
    }
    return new Response(
      JSON.stringify({
        success: false,
        messages: user[0].messages,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occured:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not Authenticated",
      }),
      { status: 500 }
    );
  }
}
