"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import ParkingTable from "@/components/ParkingTable";
import Receipt from "@/components/Receipt";

export default function Records() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [receiptRecord, setReceiptRecord] = useState(null);
  const [exitModal, setExitModal] = useState(null);
  const [exitFee, setExitFee] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (vehicleType) params.set("vehicleType", vehicleType);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      params.set("page", page);

      const res = await fetch(`/api/parking?${params.toString()}`);
      const data = await res.json();
      setRecords(data.records);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    } finally {
      setLoading(false);
    }
  }, [search, status, vehicleType, dateFrom, dateTo, page]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleExit = async () => {
    if (!exitModal) return;
    try {
      const res = await fetch(`/api/parking/${exitModal._id}/exit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fee: parseFloat(exitFee) || exitModal.fee }),
      });

      if (res.ok) {
        const updated = await res.json();
        setExitModal(null);
        setExitFee("");
        setReceiptRecord(updated);
        toast.success(`Vehicle ${updated.vehicleNumber} exited successfully!`);
        fetchRecords();
      }
    } catch (err) {
      toast.error("Failed to exit vehicle");
    }
  };

  const handleDelete = async (record) => {
    if (!confirm(`Delete record for ${record.vehicleNumber}?`)) return;
    try {
      await fetch(`/api/parking/${record._id}`, { method: "DELETE" });
      toast.success("Record deleted successfully!");
      fetchRecords();
    } catch (err) {
      toast.error("Failed to delete record");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecords();
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setVehicleType("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Parking Records</h1>
        <p className="text-slate-500 text-sm mt-1">
          {total} total records found
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-6 gap-3"
        >
          <input
            type="text"
            placeholder="Search vehicle no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="parked">Parked</option>
            <option value="exited">Exited</option>
          </select>
          <select
            value={vehicleType}
            onChange={(e) => {
              setVehicleType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Types</option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Truck">Truck</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <ParkingTable
          records={records}
          loading={loading}
          onExit={(record) => {
            setExitModal(record);
            setExitFee(record.fee || "");
          }}
          onPrint={(record) => setReceiptRecord(record)}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-slate-100 rounded-md text-sm disabled:opacity-50 hover:bg-slate-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 bg-slate-100 rounded-md text-sm disabled:opacity-50 hover:bg-slate-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Exit Modal */}
      {exitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Vehicle Exit
            </h3>
            <p className="text-sm text-slate-500 mb-1">
              Vehicle: <strong>{exitModal.vehicleNumber}</strong>
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Type: {exitModal.vehicleType}
            </p>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Final Fee (₹)
            </label>
            <input
              type="number"
              value={exitFee}
              onChange={(e) => setExitFee(e.target.value)}
              placeholder="Enter final fee"
              min="0"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-lg"
            />

            <div className="flex gap-3">
              <button
                onClick={handleExit}
                className="flex-1 bg-orange-600 text-white py-2.5 rounded-lg font-medium hover:bg-orange-700 transition-colors cursor-pointer"
              >
                Mark Exit
              </button>
              <button
                onClick={() => {
                  setExitModal(null);
                  setExitFee("");
                }}
                className="flex-1 bg-slate-200 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptRecord && (
        <Receipt
          record={receiptRecord}
          onClose={() => setReceiptRecord(null)}
        />
      )}
    </div>
  );
}
