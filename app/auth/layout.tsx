"use client";

import { Header } from "@/components/Features/Header";
import { UserProvider } from "@/context/UserContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
