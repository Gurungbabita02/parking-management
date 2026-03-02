import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Parking from "@/lib/models/Parking";

// GET /api/parking/:id - Get single record
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const record = await Parking.findById(id);

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/parking/:id - Delete record
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const record = await Parking.findByIdAndDelete(id);

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
