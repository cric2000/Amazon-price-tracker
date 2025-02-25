"use server";

import * as cheerio from "cheerio";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";


interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  url: string;
  title: string;
  currentPrice: number;
  targetPrice: number;
  imageUrl: string | null;
}



export async function signUp(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return { success: false, message: "Email already exists" };

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({ data: { email, password: hashedPassword } });

  return await login(email, password);
}


export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { success: false, message: "User not found" };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return { success: false, message: "Invalid password" };

  const token = sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });
  cookies().set("token", token, { httpOnly: true, path: "/" });

  return { success: true, user };
}


export async function logout() {
  cookies().delete("token");
  return { success: true };
}


export async function getCurrentUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const decoded: any = verify(token, SECRET_KEY);
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch {
    return null;
  }
}



export async function updatePrices() {
  try {
    const products = await prisma.product.findMany();

    for (const product of products) {
      try {
        const response = await fetch(product.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        });

        const html = await response.text();
        const $ = cheerio.load(html);


        const priceStr = $(".a-price-whole").first().text().trim() + $(".a-price-fraction").first().text().trim();
        const newPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ""));

        if (isNaN(newPrice)) {
          console.warn(`Could not fetch price for ${product.title}`);
          continue;
        }


        if (newPrice !== product.currentPrice) {

          await prisma.product.update({
            where: { id: product.id },
            data: { currentPrice: newPrice },
          });

          await prisma.priceHistory.create({
            data: {
              productId: product.id,
              price: newPrice,
            },
          });

  
          if (newPrice <= product.targetPrice) {
            await sendPriceAlert(product, newPrice);
          }
        }

      } catch (error) {
        console.error(`Error updating price for ${product.title}:`, error);
      }
    }

    return { success: true, message: "Updated product prices" };
  } catch (error) {
    console.error("Error updating prices:", error);
    return { success: false, error: "Failed to update product prices" };
  }
}



async function sendPriceAlert(product: Product, newPrice: number) {
  if (!product.userId) return;


  const user = await prisma.user.findUnique({ where: { id: product.userId } });
  if (!user || !user.email) return;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Price Drop Alert: ${product.title}`,
    html: `
      <p>Good news! The price for <strong>${product.title}</strong> has dropped to <strong>Rs ${newPrice}</strong>.</p>
      <p>Your target price was <strong>Rs ${product.targetPrice}</strong>.</p>
      <p><a href="${product.url}" target="_blank">Buy Now</a></p>
    `,
  });

  //console.log(`Email sent to ${user.email} for ${product.title}`);
}


export async function addProduct(email: string, url: string, targetPrice: number) {
  try {

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }


    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("#productTitle").text().trim();
    const priceStr = $(".a-price-whole").first().text().trim() + $(".a-price-fraction").first().text().trim();
    const currentPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    const imageUrl = $("#landingImage").attr("src");


    const product = await prisma.product.create({
      data: {
        url,
        title,
        currentPrice,
        targetPrice,
        imageUrl,
        userId: user.id, 
      },
    });

  
    await prisma.priceHistory.create({
      data: {
        productId: product.id,
        price: currentPrice,
      },
    });

    return { success: true, product };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to add product" };
  }
}


export async function getProducts(userId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { userId }, 
      orderBy: { createdAt: "desc" },
      include: {
        priceHistory: {
          orderBy: { checkedAt: "desc" },
          take: 1,
        },
      },
    });

    return { success: true, products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}


export async function updateTargetPrice(productId: string, newPrice: number) {
    try {
      await prisma.product.update({
        where: { id: productId },
        data: { targetPrice: newPrice },
      });
  
      revalidatePath(`/product/${productId}`);
  
      return { success: true };
    } catch (error) {
      console.error("Error updating target price:", error);
      return { success: false, error: "Failed to update target price" };
    }
  }