import { Loader2 } from "lucide-react";

type LoadingProps = {
  text?: string;
};

export default function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
      <p className="mt-2 text-gray-600 text-lg">{text}</p>
    </div>
  );
}
