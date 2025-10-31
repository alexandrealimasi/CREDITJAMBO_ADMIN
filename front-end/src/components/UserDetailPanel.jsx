import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const getStatusClasses = (status) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const UserDetailPanel = ({
  selectedUser,
  userIndex,
  actionType,
  setShowDetailPanel,
  handleApproveUser,
  handleRejectUser,
  verifying,
}) => {
  const [rejectReason, setRejectReason] = useState("");

  if (!selectedUser) return null;

  const status = selectedUser.devices?.[0]?.status || "PENDING";
  const userId = selectedUser._id || selectedUser.id;

  return (
    <div className="fixed top-20 right-8 w-96 bg-white shadow-2xl rounded-xl border border-gray-200 z-50 animate-slideIn">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-5 py-4">
        <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
        <button
          onClick={() => setShowDetailPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 text-sm text-gray-700">
        <p><strong>Name:</strong> {selectedUser.name}</p>
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <p><strong>Balance:</strong> ${selectedUser.balance ?? 0}</p>
        <p><strong>Device ID:</strong> {selectedUser.devices?.[0]?.deviceId || "N/A"}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(
              status
            )}`}
          >
            {status}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="border-t px-5 py-4 flex flex-col gap-3">
        {actionType === "APPROVE" && (
          <button
            className={`py-2 rounded text-white transition ${
              verifying
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={() => handleApproveUser(userId)}
            disabled={verifying}
          >
            {verifying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              "Approve"
            )}
          </button>
        )}

        {actionType === "REJECT" && (
          <>
            <input
              type="text"
              placeholder="Reason for rejection"
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <button
              className={`py-2 rounded text-white transition ${
                verifying
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={() => handleRejectUser(userId, rejectReason)}
              disabled={verifying}
            >
              {verifying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : (
                "Reject"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetailPanel;
