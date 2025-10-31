import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TransactionsDataTable from "../components/TransactionsDataTable";
import TransactionDetailPanel from "../components/TransactionDetailPanel";
import { getTransactions } from "../services/adminService";
import Loader from "../components/Loader";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (tx) => {
    setSelectedTx(tx);
    setShowDetailPanel(true);
  };

  // Filter logic
  useEffect(() => {
    let filtered = [...transactions];

    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (tx) => tx.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (tx) =>
          tx.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFrom) {
      filtered = filtered.filter((tx) => new Date(tx.createdAt) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter((tx) => new Date(tx.createdAt) <= new Date(dateTo));
    }

    setFilteredTransactions(filtered);
  }, [typeFilter, searchTerm, dateFrom, dateTo, transactions]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 relative">
          <h1 className="text-2xl font-bold mb-4">Transactions</h1>

          {/* 🔍 Filter Section */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
            {/* Type Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Type</label>
              <select
                className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">From</label>
              <input
                type="date"
                className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">To</label>
              <input
                type="date"
                className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            {/* Search */}
            <div className="flex flex-col flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-600">Search</label>
              <input
                type="text"
                placeholder="Search by name or email"
                className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Reset Button */}
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm"
              onClick={() => {
                setTypeFilter("all");
                setSearchTerm("");
                setDateFrom("");
                setDateTo("");
                setFilteredTransactions(transactions);
              }}
            >
              Reset
            </button>
          </div>

          {/* Loader Overlay */}
          {loading && <Loader message="Loading transactions..." />}

          {/* Table */}
          {!loading && (
            <TransactionsDataTable data={filteredTransactions} onView={handleView} />
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {showDetailPanel && selectedTx && (
        <TransactionDetailPanel
          transaction={selectedTx}
          index={transactions.findIndex((t) => t._id === selectedTx._id)}
          setShowDetailPanel={setShowDetailPanel}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
