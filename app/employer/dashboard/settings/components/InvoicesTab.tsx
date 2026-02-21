"use client";
import React, { useState } from "react";
import { Download } from "lucide-react";

const allInvoices = [
  { id: "INV-2026-012", date: "Feb 15, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-011", date: "Jan 15, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2025-010", date: "Dec 15, 2025", amount: "$49.00", status: "Paid" },
  { id: "INV-2025-009", date: "Nov 15, 2025", amount: "$49.00", status: "Paid" },
  { id: "INV-2025-008", date: "Oct 15, 2025", amount: "$29.00", status: "Paid" },
  { id: "INV-2025-007", date: "Sep 15, 2025", amount: "$29.00", status: "Pending" },
  { id: "INV-2025-006", date: "Aug 15, 2025", amount: "$29.00", status: "Paid" },
  { id: "INV-2025-005", date: "Jul 15, 2025", amount: "$29.00", status: "Paid" },
];

export default function InvoicesTab() {
  const [visible, setVisible] = useState(6);

  return (
    <div className="w-full h-fit p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900">Invoice History</h2>
        <p className="text-sm text-gray-500">View and download your past invoices.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 tracking-wide">INVOICE</th>
              <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 tracking-wide">DATE</th>
              <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 tracking-wide">AMOUNT</th>
              <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 tracking-wide">STATUS</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {allInvoices.slice(0, visible).map((inv, i) => (
              <tr key={inv.id} className={i !== 0 ? "border-t border-gray-200" : ""}>
                <td className="px-5 py-4 text-sm font-bold text-gray-900">{inv.id}</td>
                <td className="px-5 py-4 text-sm text-gray-400">{inv.date}</td>
                <td className="px-5 py-4 text-sm font-bold text-gray-900">{inv.amount}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    inv.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-gray-200 bg-gray-100 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-400">Showing {Math.min(visible, allInvoices.length)} invoices</p>
          {visible < allInvoices.length && (
            <button
              onClick={() => setVisible((v) => v + 6)}
              className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}