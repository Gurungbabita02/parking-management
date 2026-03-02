"use client";
import { useState } from "react";
import ParkingForm from "@/components/ParkingForm";
import Receipt from "@/components/Receipt";

export default function NewEntry() {
  const [createdRecord, setCreatedRecord] = useState(null);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          New Parking Entry
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Register a new vehicle parking
        </p>
      </div>

      <div className="max-w-lg">
        <div className="bg-white rounded-xl xs:p-4 shadow-sm border border-slate-200 p-6">
          <ParkingForm onSuccess={(record) => setCreatedRecord(record)} />
        </div>
      </div>

      {/* Receipt Modal */}
      {createdRecord && (
        <Receipt
          record={createdRecord}
          onClose={() => setCreatedRecord(null)}
        />
      )}
    </div>
  );
}
