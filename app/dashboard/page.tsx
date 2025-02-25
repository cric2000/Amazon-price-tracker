"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getProducts } from "../action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleXIcon, CrossIcon, FolderClosedIcon, Plus, SidebarCloseIcon } from "lucide-react";
import Link from "next/link";
import AddProduct from "./add/page";
import { Loader2 } from "lucide-react";

interface User {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Product {
    id: string;
    title: string;
    targetPrice: number;
    currentPrice: number;
    imageUrl: string | null;
}

export default function Dashboard() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true); 
    const [showModal, setShowModal] = useState(false);

    async function fetchData() {
        const fetchedUser = await getCurrentUser();

        if (!fetchedUser) {
            router.push("/auth");
            return;
        }

        setLoading(true); 

        const response = await getProducts(fetchedUser.id);

        if (response?.success) {
            setProducts(response.products ?? []);
        } else {
            console.error(response?.error || "Failed to fetch products");
        }

        setLoading(false);
    }


    useEffect(() => {
        fetchData();
    }, [router]);

    const handleProductAdded = () => {
        setShowModal(false); 
        fetchData(); 
    };


    return (
        <div>
            
            <div className="container pb-10 mt-[80px]">
            
                {loading ? (
                    <div className="flex justify-center items-center w-screen h-screen gap-4 flex-wrap">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                        <span className=" text-black text-lg">Loading data...</span>
                    </div>
                ) : (
                    <>
             
                        {!products.length ? (
                            <div className="py-10 w-screen h-screen">
                                <p className="text-lg font-medium text-center py-10">Add products to track</p>
                                <AddProduct onProductAdded={handleProductAdded} />
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-wrap gap-2 justify-between items-center mb-4 py-10 px-8 w-screen">
                                    <span className="text-xl font-medium">Products</span>
                                    <Button onClick={() => setShowModal(true)} variant="default">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add More
                                    </Button>
                                </div>

                             
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
                                    {products.map((product) => (
                                        <Card key={product.id}>
                                            <CardHeader>
                                                <CardTitle className="line-clamp-2 text-ellipsis overflow-hidden text-md">{product.title}</CardTitle>
                                                <CardDescription className="font-medium text-md">Target Price: Rs {product.targetPrice}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[210px] relative mb-4">
                                                    {product.imageUrl && (
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={product.title}
                                                            className="object-contain w-full h-[200px]"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2 justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Current Price</p>
                                                        <p className="text-xl font-medium">Rs {product.currentPrice}</p>
                                                    </div>
                                                    <Link href={`/dashboard/product/${product.id}`}>
                                                        <Button variant="outline">View Details</Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                      
                                {showModal && (
                                    <div
                                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <div
                                            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <h2 className="text-xl font-semibold">Add Product</h2>
                                                <Button variant="ghost" onClick={() => setShowModal(false)}>
                                                    <CircleXIcon/>
                                                </Button>
                                            </div>
                                            <AddProduct onProductAdded={handleProductAdded} />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
