import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const TransactionDetailPanel = ({ transaction, index, setShowDetailPanel }) => {
  if (!transaction) return null;

  return (
    <div className="fixed top-20 right-5 w-96 bg-white shadow-lg rounded-2xl border border-gray-200 z-50 transition-all duration-300 animate-slideIn">
      <div className="flex justify-between items-center border-b px-5 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Transaction Details</h2>
        <button
          onClick={() => setShowDetailPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="p-5 space-y-2 text-sm text-gray-700">
      
        <p><span className="font-semibold text-gray-600">User:</span> {transaction.userId?.name || "N/A"}</p>
        <p><span className="font-semibold text-gray-600">Email:</span> {transaction.userId?.email || "N/A"}</p>
        <p>
          <span className="font-semibold text-gray-600">Amount:</span>{" "}
          <span className={`${transaction.type === "withdraw" ? "text-red-600" : "text-green-600"} font-semibold`}>
            ${transaction.amount}
          </span>
        </p>
        <p><span className="font-semibold text-gray-600">Type:</span> {transaction.type}</p>
        <p><span className="font-semibold text-gray-600">Date:</span> {new Date(transaction.createdAt).toLocaleString()}</p>
        {transaction.notes && (
          <p><span className="font-semibold text-gray-600">Notes:</span> {transaction.notes}</p>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailPanel;
