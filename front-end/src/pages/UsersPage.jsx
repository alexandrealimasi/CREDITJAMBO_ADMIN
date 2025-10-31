import React, { useEffect, useState } from "react";
import api from "../services/api";
import { notifySuccess, notifyError } from "../utils/toast";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import UsersDataTable from "../components/UsersDataTable";
import UserDetailPanel from "../components/UserDetailPanel";
import { verifyUser } from "../services/adminService";

const STATUS_OPTIONS = ["all", "PENDING", "APPROVED", "REJECTED"];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    date: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [actionType, setActionType] = useState("VIEW");
  const [verifying, setVerifying] = useState(false);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        notifyError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Apply filters
  useEffect(() => {
    const result = users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === "all" || user.devices?.[0]?.status === filters.status;
      const matchesDate =
        !filters.date ||
        new Date(user.createdAt).toISOString().split("T")[0] === filters.date;
      return matchesSearch && matchesStatus && matchesDate;
    });
    setFilteredUsers(result);
  }, [users, filters]);

  const openPanel = (user, index, type) => {
    setSelectedUser(user);
    setSelectedUserIndex(index);
    setActionType(type);
    setShowDetailPanel(true);
  };

  const handleVerifyUser = async (userId, status, reason = null) => {
    try {
      setVerifying(true);
      await verifyUser({ userId, status, rejectionReason: reason });

      // Refresh users after action
      const res = await api.get("/admin/users");
      setUsers(res.data);

      notifySuccess(
        status === "APPROVED"
          ? "User approved successfully!"
          : "User rejected successfully!"
      );

      setShowDetailPanel(false);
      setSelectedUser(null);
      setSelectedUserIndex(null);
    } catch (err) {
      notifyError(`Failed to ${status.toLowerCase()} user.`);
    } finally {
      setVerifying(false);
    }
  };

  const resetFilters = () =>
    setFilters({ search: "", status: "all", date: "" });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Users</h1>

          {/* Filter Card */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search by name or email"
              className="border rounded px-3 py-2 w-full sm:w-64"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />

            <select
              className="border rounded px-3 py-2"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border rounded px-3 py-2"
              value={filters.date}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, date: e.target.value }))
              }
            />

            <button
              className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>

          {/* Loader */}
          {loading && <Loader message="Loading users..." />}

          {/* Users Table */}
          {!loading && (
            <UsersDataTable
              data={filteredUsers}
              onView={(u, i) => openPanel(u, i, "VIEW")}
              onApprove={(u, i) => openPanel(u, i, "APPROVE")}
              onReject={(u, i) => openPanel(u, i, "REJECT")}
            />
          )}
        </div>

        {/* Detail Panel */}
        {showDetailPanel && selectedUser && (
          <UserDetailPanel
            selectedUser={selectedUser}
            userIndex={selectedUserIndex}
            actionType={actionType}
            setShowDetailPanel={setShowDetailPanel}
            handleApproveUser={(id) => handleVerifyUser(id, "APPROVED")}
            handleRejectUser={(id, reason) =>
              handleVerifyUser(id, "REJECTED", reason)
            }
            verifying={verifying}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
