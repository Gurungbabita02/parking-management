import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Parking from "@/lib/models/Parking";

// GET /api/parking - List records with filters
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const vehicleType = searchParams.get("vehicleType") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    const query = {};

    if (search) {
      query.vehicleNumber = { $regex: search, $options: "i" };
    }
    if (status) {
      query.status = status;
    }
    if (vehicleType) {
      query.vehicleType = vehicleType;
    }
    if (dateFrom || dateTo) {
      query.entryTime = {};
      if (dateFrom) query.entryTime.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        query.entryTime.$lte = end;
      }
    }

    const total = await Parking.countDocuments(query);
    const records = await Parking.find(query)
      .sort({ entryTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/parking - Create new entry
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.vehicleNumber || !body.vehicleType) {
      return NextResponse.json(
        { error: "Vehicle number and type are required" },
        { status: 400 }
      );
    }

    const record = new Parking({
      vehicleNumber: body.vehicleNumber,
      vehicleType: body.vehicleType,
      entryTime: body.entryTime || new Date(),
      fee: body.fee || 0,
    });

    await record.save();
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("POST /api/parking error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
