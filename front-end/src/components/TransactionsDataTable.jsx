import React from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid"; // using Heroicons

const getTypeClasses = (type) => {
  return type === "deposit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};

const TransactionsDataTable = ({ data, onView }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["#", "User", "Email", "Amount", "Transaction", "Date", "Actions"].map((col) => (
              <th
                key={col}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.length ? (
            data.map((tx, index) => {
              const isDeposit = tx.type === "deposit";
              return (
                <tr key={tx._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{tx.userId?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{tx.userId?.email || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${tx.amount}</td>
                  <td className="px-6 py-4 text-sm flex items-center gap-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeClasses(
                        tx.type
                      )}`}
                    >
                      {tx.type}
                    </span>
                    {isDeposit ? (
                      <ArrowDownIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowUpIcon className="w-4 h-4 text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(tx.createdAt).toLocaleDateString("en-CA")}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                      onClick={() => onView(tx, index)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500 text-sm">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsDataTable;
