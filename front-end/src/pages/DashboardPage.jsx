import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    recentTransactions: [],
    monthlyStats: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform monthlyStats for chart
  const chartData = stats.monthlyStats.map((m) => {
    let deposits = 0;
    let withdrawals = 0;
    stats.recentTransactions.forEach((tx) => {
      if (tx.createdAt.startsWith(m.month)) {
        if (tx.type.toLowerCase() === "deposit") deposits += tx.amount;
        else if (tx.type.toLowerCase() === "withdraw") withdrawals += tx.amount;
      }
    });
    return { month: m.month, deposits, withdrawals };
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />

        <div className="p-6 w-full">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Loader below title */}
          {loading && <Loader message="Loading dashboard..." />}

          {!loading && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow w-full border border-gray-200">
                  <h2 className="text-gray-500">Total Users</h2>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow w-full border border-gray-200">
                  <h2 className="text-gray-500">Total Deposits</h2>
                  <p className="text-2xl font-bold text-green-600">
                    ${chartData.reduce((acc, m) => acc + m.deposits, 0)}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow w-full border border-gray-200">
                  <h2 className="text-gray-500">Total Withdrawals</h2>
                  <p className="text-2xl font-bold text-red-600">
                    ${chartData.reduce((acc, m) => acc + m.withdrawals, 0)}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-lg shadow mb-8 w-full border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">
                  Deposits & Withdrawals (Monthly)
                </h2>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="deposits" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="withdrawals" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white p-6 rounded-lg shadow w-full border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">User</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentTransactions.map((tx, idx) => (
                        <tr key={tx._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{idx + 1}</td>
                          <td className="px-4 py-2">{tx.userId?.name || "N/A"}</td>
                          <td className="px-4 py-2">{tx.type}</td>
                          <td
                            className={`px-4 py-2 font-medium ${
                              tx.type.toLowerCase() === "deposit"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {tx.type.toLowerCase() === "deposit" ? "+" : "-"}${tx.amount}
                          </td>
                          <td className="px-4 py-2 text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString("en-CA")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
