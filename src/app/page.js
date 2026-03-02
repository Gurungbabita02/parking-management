"use client";
import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/parking/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="text-center py-20 text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl xs:text-base font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Today&apos;s parking overview
          </p>
        </div>
        <Link
          href="/new-entry"
          className="bg-blue-600 xs:text-sm xs:px-2 xs:py-2 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + New Entry
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Vehicles Today"
          value={stats?.todayTotal || 0}
          icon="🚗"
          color="blue"
        />
        <StatCard
          title="Currently Parked"
          value={stats?.currentlyParked || 0}
          icon="🅿️"
          color="green"
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${stats?.todayRevenue || 0}`}
          icon="💰"
          color="yellow"
        />
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Entries
          </h2>
          <Link
            href="/records"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          {stats?.recentEntries?.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
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
                    Fee
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentEntries.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {record.vehicleNumber}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {record.vehicleType === "Car" && "🚗 "}
                      {record.vehicleType === "Bike" && "🏍️ "}
                      {record.vehicleType === "Truck" && "🚛 "}
                      {record.vehicleType}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {formatDate(record.entryTime)}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ₹{record.fee || 0}
                    </td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-2">📋</p>
              <p>No entries yet today.</p>
              <Link
                href="/new-entry"
                className="text-blue-600 text-sm hover:underline"
              >
                Create your first entry
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
