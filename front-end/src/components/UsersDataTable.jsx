import React from "react";

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

const UsersDataTable = ({ data, onView, onApprove, onReject }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["#", "Name", "Email", "Status", "Date Created", "Actions"].map((col) => (
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
            data.map((user, index) => {
              const status = user.devices?.[0]?.status || "PENDING";

              return (
                <tr key={user._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString("en-CA")}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                      onClick={() => onView(user, index)}
                    >
                      View
                    </button>

                    {status !== "APPROVED" && (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                        onClick={() => onApprove(user, index)}
                      >
                        Approve
                      </button>
                    )}

                    {status !== "REJECTED" && (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                        onClick={() => onReject(user, index)}
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersDataTable;
