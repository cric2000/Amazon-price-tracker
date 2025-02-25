import { prisma } from "@/lib/prisma";
import ProductDetail from "./ProductDetail";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return <div className="text-center text-red-500 text-xl mt-10">Product not found</div>;
  }

  return <ProductDetail product={product} />;
}
