import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Parking from "@/lib/models/Parking";

// GET /api/parking/stats - Dashboard statistics
export async function GET() {
  try {
    await connectDB();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todayTotal, currentlyParked, todayRevenue, recentEntries] =
      await Promise.all([
        // Total vehicles today
        Parking.countDocuments({
          entryTime: { $gte: todayStart, $lte: todayEnd },
        }),
        // Currently parked
        Parking.countDocuments({ status: "parked" }),
        // Today's revenue
        Parking.aggregate([
          {
            $match: {
              entryTime: { $gte: todayStart, $lte: todayEnd },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$fee" },
            },
          },
        ]),
        // Recent 10 entries
        Parking.find().sort({ entryTime: -1 }).limit(10),
      ]);

    return NextResponse.json({
      todayTotal,
      currentlyParked,
      todayRevenue: todayRevenue[0]?.total || 0,
      recentEntries,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
