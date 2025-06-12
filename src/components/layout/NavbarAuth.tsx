"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";
import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/")}
        >
          <Dumbbell className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">GymTracker Pro</h1>
        </div>
        <div className="flex gap-4">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="text-black">Dashboard</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <Link href="/dashboard">Dashboard</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-black">Routine</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <Link href="/routine">Routine</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-black">Progress</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <Link href="/progress">Progress</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-black">Settings</MenubarTrigger>
              <MenubarContent>
                <MenubarItem inset>
                  <Link href="/settings">Settings</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <Avatar className="size-10 border-white/10">
            <AvatarImage
              className="rounded-full"
              src="https://github.com/shadcn.png"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
