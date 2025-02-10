import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";

const Header = () => {
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="QuantumFi"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
          <span
            className="text-3xl font-bold"
            style={{
              color: "#52A0A4",
            }}
          >
            QuantumFi
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Signed-in UI */}
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="text-gray-600 hover:text-blue-800 flex items-center gap-2">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/transaction/create">
              <Button variant="outline" className="text-gray-600 hover:text-blue-800 flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>

            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>

          {/* Signed-out UI */}
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard" asChild={true}>
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </div>
  );
};

export default Header;
