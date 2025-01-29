'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from 'next/navigation'
import {useEffect, useState} from "react"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/type/ApiResponse"
import {Input} from "@/components/ui/input"
import {verifySchema} from "@/schemas/verifySchema"
import React from "react"
import {Form, FormField, FormItem,FormLabel, FormControl,FormDescription, FormMessage  } from "@/components/ui/form"
import { Button } from "@/components/ui/button"


function VerifyAccount() {
  const router = useRouter()
  const params = useParams<{username: string}>()
  const { toast } = useToast()
  //zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  })
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log("Form Data Submitted:", data);
    try {
      console.log("Sending data:", {
        username: params.username,
        code: data.code,
      });
  
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
  
      console.log("Response from server:", response.data);
  
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("sign-in");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        toast({
          title: "Signup failed",
          description: error.response?.data.message || "Something went wrong",
          variant: "destructive",
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };
 
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white-300 rounded-lg shadow-md">
    <div className="text-center">
     <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
     Verify Your Account
     </h1>
     <p className="mb-4">Enter the verification code sent to your email</p>
    </div>
    <div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
    </div>  
  </div>
  );
}

export default VerifyAccount;