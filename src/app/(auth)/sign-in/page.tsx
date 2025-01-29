'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceValue,  useDebounceCallback  } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import {useEffect, useState} from "react"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/type/ApiResponse"
import {Form, FormField, FormItem,FormLabel, FormControl,FormDescription, FormMessage  } from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {signInSchema} from "@/schemas/signIn"
import { Loader2 } from 'lucide-react'
import { signIn } from "next-auth/react"


const page = () => {
 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email:'',
      password:''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true); // Disable the button during submission
    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: true,  // ✅ This will automatically redirect on success
        callbackUrl: "/dashboard", // ✅ Ensure the correct URL
      });
      
  
      if (result?.error) {
        toast({
          title: "Login Failed",
          description:
            result.error === "CredentialsSignin"
              ? "Incorrect email or password"
              : result.error,
          variant: "destructive",
        });
      } else if (result?.url) {
        router.replace("/dashboards"); // ✅ Fix URL (no 's' at the end)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white-300 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join RealTime Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure.</p>
        </div>
        <Form {...form}>
          <>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="email/Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
               Sign In
              </Button>
            </form>
          </>
        </Form>
        <div className="text-center mt-4">
          <p>
            Don't have an Account? click here -{' '}
            <Link href="/sign-up">
              <span className="text-green-500 hover:text-green-300">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default page;
