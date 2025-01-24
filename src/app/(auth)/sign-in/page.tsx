'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function SignInPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <p>Signed in as {session.user?.email}</p>
        <button 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p>Not signed in</p>
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      >
        Sign in with Google
      </button>
    </div>
  )
}