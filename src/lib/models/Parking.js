import mongoose from "mongoose";

const ParkingSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, "Vehicle number is required"],
    uppercase: true,
    trim: true,
  },
  vehicleType: {
    type: String,
    enum: ["Car", "Bike", "Truck"],
    required: [true, "Vehicle type is required"],
  },
  entryTime: {
    type: Date,
    default: Date.now,
  },
  exitTime: {
    type: Date,
    default: null,
  },
  fee: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["parked", "exited"],
    default: "parked",
  },
  receiptNumber: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 365 * 24 * 60 * 60, // TTL: 1 year (auto-delete)
  },
});

// Auto-generate receipt number before saving
ParkingSchema.pre("save", function () {
  if (!this.receiptNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.receiptNumber = `PKR-${timestamp}-${random}`;
  }
});

export default mongoose.models.Parking ||
  mongoose.model("Parking", ParkingSchema);
