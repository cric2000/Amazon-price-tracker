"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { login, signUp } from "../action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {  Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(data: any) {
    setLoading(true);
    const response = isLogin ? await login(data.email, data.password) : await signUp(data.email, data.password);
    setLoading(false);

    if (response.success) {
      toast({ title: isLogin ? "Login successful!" : "Account created successfully!", variant: "default", });
      router.push("/dashboard");
    } else {
      toast({ title: "Error", description: response.message ?? "Something went wrong. Please try again.", variant: "destructive" });
    }
  }

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-yellow-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center font-normal">{isLogin ? "Login" : "Sign Up"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div className="relative">
                <Mail className="absolute mt-2.5 ml-2 text-gray-500 w-5 h-5"/>
              <Input
                type="email"
                placeholder="Email"
                {...register("email", { 
                    required: "Email is required", 
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address"
                    }
                  })}
                className="w-full pl-10"
                required
              />
                </div>
               
            {errors.email && <p className="text-sm text-red-500 mt-1">{String(errors.email.message)}</p>}
            </div>

            <div>
            <div className="relative">
            <Lock className="absolute mt-2.5 ml-2 text-gray-500 w-5 h-5"/>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full pl-10"
                required
              />
               <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-2.5 text-gray-500"
      >
        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>}
            </div>

            <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-800" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Sign up"}
            </Button>
          </form>

          <p className="text-center mt-4 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 p-0" variant="link">
              {isLogin ? "Sign up" : "Login"}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
