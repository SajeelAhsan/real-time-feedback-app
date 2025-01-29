'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from "@/components/ui/button"; // Ensure Button is imported

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className='p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <a className='text-xl font-bold mb-4 md:mb-0' href="#">Real Time Feedback</a>
        {session ? ( // ✅ Fixed "session" typo
          <>
            <span className='mr-4'>Welcome, {user?.name || user?.email}</span>
            <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <Link href='/sign-in'>
            <Button className='w-full md:w-auto'>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
