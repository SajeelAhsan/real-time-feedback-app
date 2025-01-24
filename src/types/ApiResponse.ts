import { Message } from "@/model/User.model.ts"

export interface ApiResponse{
  sucess: bolean;
  message: string;
  isAcceptingMessage?: bolean;
  messages?: Array<Message>

}