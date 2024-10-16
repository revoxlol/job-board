import { getSignInUrl, getUser, signOut, getSignUpUrl } from "@workos-inc/authkit-nextjs";
import Link from "next/link";

export default async function Header() {
  const { user } = await getUser();

  try {
    if (user) {
      console.log("User fetched successfully:", user);
    } else {
      console.log("No user data found.");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();

  return (
    <header>
      <div className="w-full flex items-center justify-between px-4 my-4">
        <Link href={'/'} className="font-bold text-xl">Carièrre HomaBIM</Link>
        <nav className="flex gap-2">
          {!user && (
            <>
              {/* Show Login button if user is not logged in */}
              <Link className="rounded-md bg-gray-200 py-1 px-2 sm:py-2 sm:px-4" href={signInUrl}>
                Login
              </Link>
              
              {/* Show Register button if user is not logged in */}
              <Link className="rounded-md py-1 px-2 sm:py-2 sm:px-4 bg-blue-600 text-white" href={signUpUrl}>
                Register
              </Link>
            </>
          )}
          {user && (
            <>
              {/* Show Logout button if user is logged in */}
              <form action={async () => {
                'use server';
                await signOut();
              }}>
                <button type="submit" className="rounded-md bg-gray-200 py-1 px-2 sm:py-2 sm:px-4">
                  Logout
                </button>
              </form>
              
              {/* Show Post a Job button if user is logged in */}
              <Link className="rounded-md py-1 px-2 sm:py-2 sm:px-4 bg-blue-600 text-white" href={'/new-listing'}>
                Post a job
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
