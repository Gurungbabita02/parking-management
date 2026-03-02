"use client";

export default function Receipt({ record, onClose }) {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:static print:bg-white print:inset-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 print:shadow-none print:max-w-full print:rounded-none">
        {/* Print-only receipt */}
        <div
          id="receipt-content"
          className="p-8 xs:p-5 print:p-4 print:max-w-[80mm] print:mx-auto"
        >
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
            <h2 className="text-2xl font-bold text-slate-800 print:text-xl">
              🅿️ ParkEasy
            </h2>
            <p className="text-sm text-slate-500 mt-1">Parking Receipt</p>
          </div>

          {/* Receipt Number */}
          <div className="text-center mb-4">
            <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-mono font-bold">
              {record.receiptNumber}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 text-sm">Vehicle No.</span>
              <span className="font-bold text-slate-800">
                {record.vehicleNumber}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 text-sm">Vehicle Type</span>
              <span className="font-semibold text-slate-700">
                {record.vehicleType}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 text-sm">Entry Time</span>
              <span className="text-slate-700">
                {formatDate(record.entryTime)}
              </span>
            </div>
            {record.exitTime && (
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 text-sm">Exit Time</span>
                <span className="text-slate-700">
                  {formatDate(record.exitTime)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 text-sm">Status</span>
              <span
                className={`font-semibold ${record.status === "parked" ? "text-green-600" : "text-blue-600"}`}
              >
                {record.status === "parked" ? "PARKED" : "EXITED"}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-lg font-semibold text-slate-700">Fee</span>
              <span className="text-2xl font-bold text-slate-900">
                ₹{record.fee || 0}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-slate-300">
            <p className="text-xs text-slate-400">
              Thank you for parking with us!
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {formatDate(new Date())}
            </p>
          </div>
        </div>

        {/* Action buttons - hidden when printing */}
        <div className="flex gap-3 px-8 xs:p-3 pb-6 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 xs:text-sm bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            🖨️ Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 xs:text-sm bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
