import dbConnect from "@lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from "@/model/User.model.ts";

export async function POST(req:Request) {
  await dbConnect();
  const {username, content} = await request.json()
  try {
   const user = await UserModel.findOne(username)
   if(!user){
    return new Response(
      JSON.stringify({
        success: false,
        message: "User not Found!",
      }),
      { status: 404 }
    );
   }
   //is user accepting the messages
   if(user.isAcceptingMessage){
    return new Response(
      JSON.stringify({
        success: false,
        message: "User is not Accepting messages",
      }),
      { status: 403 }
    );
   }
   const newMessage = {content, createdAt: new Date()}
   user.messages.push(newMessage as Message)
   await user.save()
   return new Response(
    JSON.stringify({
      success: true,
      message: "Message sent successfully!",
    }),
    { status: 404 }
  );
  } catch (error) {
    console.error("Error adding message:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      { status: 500 }
    );
  }
}