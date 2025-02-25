"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTargetPrice } from "@/app/action";

interface ProductProps {
  product: {
    id: string;
    title: string;
    imageUrl: string | null;
    targetPrice: number;
    currentPrice: number;
  };
}

export default function ProductDetail({ product }: ProductProps) {
  return (
    <div className="container mx-auto py-10 mt-[80px]">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>{product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square relative mb-4">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="object-contain w-full h-full"
              />
            )}
          </div>
          <p className="text-lg">
            <span className="font-semibold">Current Price:</span> Rs {product.currentPrice}
          </p>

    
          <EditTargetPrice productId={product.id} targetPrice={product.targetPrice} />
        </CardContent>
      </Card>
    </div>
  );
}

function EditTargetPrice({ productId, targetPrice }: { productId: string; targetPrice: number }) {
  const [price, setPrice] = useState(targetPrice);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpdate() {
    setLoading(true);
    setMessage("");

    const res = await updateTargetPrice(productId, price);

    if (res.success) {
      setMessage("Target price updated!");
    } else {
      setMessage("Failed to update price.");
    }

    setLoading(false);
  }

  return (
    <div className="mt-4">
      <label className="block text-lg font-semibold">Target Price:</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border rounded-md p-2 w-full"
      />
      <Button onClick={handleUpdate} className="mt-2" disabled={loading}>
        {loading ? "Updating..." : "Update Price"}
      </Button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
