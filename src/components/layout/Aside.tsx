"use client";

import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between sticky top-0">
      {/* Logo Section */}
      <div className="p-6">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => (window.location.href = "/")}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && (window.location.href = "/")}
        >
          <Dumbbell className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl font-bold">GymTracker Pro</h1>
        </div>
        {/* Navigation Links */}
        <nav className="mt-10 flex flex-col space-y-4">
          <Link href="/dashboard">
            <Button className="px-4 py-2 rounded hover:bg-gray-700">
              Dashboard
            </Button>
          </Link>
          <Link href="/routine">
            <Button className="px-4 py-2 rounded hover:bg-gray-700">
              Routine
            </Button>
          </Link>
          <Link href="/progress">
            <Button className="px-4 py-2 rounded hover:bg-gray-700">
              Progress
            </Button>
          </Link>
          <Link href="/settings">
            <Button className="px-4 py-2 rounded hover:bg-gray-700">
              Settings
            </Button>
          </Link>
        </nav>
      </div>

      {/* User Avatar Section */}
      <div className="p-6">
        <Avatar className="w-12 h-12">
          <AvatarImage
            className="rounded-full"
            src="https://github.com/shadcn.png"
            alt="User Avatar"
          />
          <AvatarFallback>GT</AvatarFallback>
        </Avatar>
      </div>
    </aside>
  );
}
