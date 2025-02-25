"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown, AlertCircle, LucideShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/app/action";
import Link from "next/link";

export function Header() {
  const router = useRouter();
  const { user, setUser, loading, error } = useUser();

  console.log(error);

  async function handleLogout() {
    await logout();
    setUser(null);
    router.push("/auth");
  }

  return (
    <header className="border-b bg-yellow-300 p-2 h-[80px] fixed top-0 left-0 right-0 z-10">
      <div className="flex h-16 items-center">
        <Link href="/" className="flex items-center justify-center gap-2 ml-2">
          <LucideShoppingCart className="h-8 w-8" />
          <span className="text-lg tracking-wide text-gray-900 sm:block hidden">
            Amazon <span className="text-gray-600 font-semibold">Price</span> Tracker
          </span>
          <span className="text-lg font-medium sm:hidden">
            A<span className="text-gray-600 font-semibold">P</span>T
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full animate-pulse bg-gray-300"></div>
              <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ) : error ? (
            <span className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-6 w-6" />
              <span title="Error loading user">Error</span>
            </span>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full hover:bg-gray-50 p-2">
                <Avatar>
                  <AvatarImage src={user.avatar || "https://via.placeholder.com/40"} />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <span className="text-gray-800">{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null
            
          }
        </div>
      </div>
    </header>
  );
}
