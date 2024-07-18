import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";


// GET route to fetch all products
export async function GET() {
  await connectDB();

  try {
    const products = await Product.find({});
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST route to add a new product
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { productName, category, price, stock } = await req.json();

    // Check if productName already exists
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      return NextResponse.json(
        { message: "Product name already exists" },
        { status: 400 },
      );
    }

    const newProduct = new Product({
      productName,
      category,
      price,
      stock,
    });

    await newProduct.save();

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 },
    );
  }
}
