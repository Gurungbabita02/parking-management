"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ParkingForm({ onSuccess }) {
  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "Car",
    fee: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/parking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleNumber: form.vehicleNumber.trim(),
          vehicleType: form.vehicleType,
          fee: parseFloat(form.fee) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create entry");
      }

      const record = await res.json();
      setForm({ vehicleNumber: "", vehicleType: "Car", fee: "" });
      toast.success(`Vehicle ${record.vehicleNumber} registered successfully!`);
      if (onSuccess) onSuccess(record);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Vehicle Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.vehicleNumber}
          onChange={(e) =>
            setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })
          }
          placeholder="e.g. MH 12 AB 1234"
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono uppercase"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Vehicle Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {["Car", "Bike", "Truck"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm({ ...form, vehicleType: type })}
              className={`py-3 xs:text-sm rounded-lg font-medium text-center transition-all cursor-pointer ${
                form.vehicleType === type
                  ? "bg-blue-600 text-white ring-2 ring-blue-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type === "Car" && "🚗"} {type === "Bike" && "🏍️"}{" "}
              {type === "Truck" && "🚛"} {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Parking Fee (₹)
        </label>
        <input
          type="number"
          value={form.fee}
          onChange={(e) => setForm({ ...form, fee: e.target.value })}
          placeholder="Enter amount"
          min="0"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full xs:text-sm xs:p-3 bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? "Creating Entry..." : "Create Parking Entry"}
      </button>
    </form>
  );
}
