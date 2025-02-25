"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addProduct, getCurrentUser } from "../../action";
import { Loader, Plus } from "lucide-react";

export default function AddProduct({ onProductAdded }: { onProductAdded: () => void }) {
  const [url, setUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const user = await getCurrentUser();
    
    if (!user || !user.email) {
      throw new Error("User not authenticated");
    }

      const result = await addProduct(user.email,url, parseFloat(targetPrice));
  
      if (!result.success) {
        throw new Error(result.error || "Failed to add product");
      }
  
      toast({
        title: "Success",
        description: "Product has been added to tracking",
      });
  
      onProductAdded();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
  
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div >
      <Card className="max-w-lg mx-auto">
        <CardContent className="py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Amazon Product URL
              </label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.amazon.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="targetPrice" className="text-sm font-medium">
                Target Price (Rs)
              </label>
              <Input
                id="targetPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="99.99"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
            {!loading ? <Plus className="mr-2 h-4 w-4" /> :<Loader className="mr-2 h-4 w-4"/>}
            
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
