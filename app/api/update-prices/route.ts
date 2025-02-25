import { NextResponse } from "next/server";
import { updatePrices } from "@/app/action"; 

export async function GET() {
  try {
    const result = await updatePrices(); 

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Error updating prices:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
