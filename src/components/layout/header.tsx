"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { useSession, signOut } from "~/lib/auth-client";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isBookingFlow = pathname.startsWith("/book");

  return (
    <header className="bg-primary text-text-inverse">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link className="font-heading text-2xl tracking-tight" href="/">
          Rélwè
        </Link>

        {!isBookingFlow && (
          <nav className="flex items-center gap-8">
            {session ? (
              <>
                <Link
                  className="text-base opacity-80 hover:opacity-100 transition-opacity"
                  href="/trips"
                >
                  My trips
                </Link>
                <button
                  className="text-base opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => signOut().then(() => router.push("/"))}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                className="h-11 px-7 inline-flex items-center bg-accent text-text rounded-lg font-heading text-base hover:bg-accent-hover transition-colors"
                href="/login"
              >
                Log in
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
