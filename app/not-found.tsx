import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white px-10">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4 text-center">Oops! The page you're looking for doesn't exist.</p>
      <Link href="/">
        <Button variant="secondary" className="mt-8">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
