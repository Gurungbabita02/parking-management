"use client";

export default function ParkingTable({
  records,
  onExit,
  onPrint,
  onDelete,
  loading,
}) {
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

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400">
        Loading records...
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-4xl mb-2">📋</p>
        <p>No parking records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Receipt #
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Vehicle No.
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Type
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Entry Time
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Exit Time
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Fee
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record._id}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="py-3 px-4 font-mono text-sm text-slate-500">
                {record.receiptNumber}
              </td>
              <td className="py-3 px-4 font-bold text-slate-800">
                {record.vehicleNumber}
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center gap-1 text-sm">
                  {record.vehicleType === "Car" && "🚗"}
                  {record.vehicleType === "Bike" && "🏍️"}
                  {record.vehicleType === "Truck" && "🚛"}
                  {record.vehicleType}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-slate-600">
                {formatDate(record.entryTime)}
              </td>
              <td className="py-3 px-4 text-sm text-slate-600">
                {formatDate(record.exitTime)}
              </td>
              <td className="py-3 px-4 font-semibold">₹{record.fee || 0}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    record.status === "parked"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {record.status === "parked" ? "PARKED" : "EXITED"}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {record.status === "parked" && (
                    <button
                      onClick={() => onExit(record)}
                      className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-200 transition-colors font-medium cursor-pointer"
                    >
                      Exit
                    </button>
                  )}
                  <button
                    onClick={() => onPrint(record)}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors font-medium cursor-pointer"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => onDelete(record)}
                    className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-200 transition-colors font-medium cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
