'use client';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import Link from 'next/link';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const user: User = session?.user as User;

  return (
    <header className="shadow-md">
      <div className="container mx-auto ">
        <div className="flex items-center p-3">
          <div className="w-1/3">Mystry Message</div>
          <div className="w-2/3 flex justify-end items-center">
            {user?.isVerified ? (
              <>
                Welcome {user?.username || user?.email}
                <Button
                  onClick={() => {
                    signOut();
                    router.push('/');
                  }}
                  className="ml-6"
                >
                  SignOut
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button>Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
