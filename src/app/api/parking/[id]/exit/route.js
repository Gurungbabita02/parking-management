import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Parking from "@/lib/models/Parking";

// PUT /api/parking/:id/exit - Mark vehicle as exited
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const record = await Parking.findById(id);

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    if (record.status === "exited") {
      return NextResponse.json(
        { error: "Vehicle already exited" },
        { status: 400 }
      );
    }

    record.exitTime = new Date();
    record.status = "exited";
    if (body.fee !== undefined) {
      record.fee = body.fee;
    }

    await record.save();
    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
