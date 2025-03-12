"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type ReportStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED";

type Report = {
  id: string;
  reporter: { email: string };
  listing: { id: string; title: string };
  reason: string;
  status: ReportStatus;
};

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }
    setToken(storedToken);

    async function fetchReports() {
      try {
        const res = await fetch(`${API_BASE}/reports`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch reports.");
        const data: Report[] = await res.json(); 
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), 
      });
      if (!res.ok) throw new Error("Failed to update report status.");
  
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId
            ? { ...report, status: newStatus as ReportStatus }
            : report
        )
      );
    } catch (err) {
      console.error("❌ Error updating report status:", err);
      alert("Failed to update report.");
    }
  };
  

  if (loading) return <p className="text-center mt-10">Loading reports...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
  <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
    <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
      Admin Dashboard
    </h1>

    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 border-b">
            <th className="text-left p-4 text-gray-700 font-semibold">Listing</th>
            <th className="text-left p-4 text-gray-700 font-semibold">Reporter</th>
            <th className="text-left p-4 text-gray-700 font-semibold">Reason</th>
            <th className="text-left p-4 text-gray-700 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-900">
                  <a
                    href={`/listing/${report.listing.id}`}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {report.listing.title}
                  </a>
                </td>
                <td className="p-4 text-gray-900">{report.reporter.email}</td>
                <td className="p-4 text-gray-900">{report.reason}</td>
                <td className="p-4">
                  <select
                    className="border border-gray-300 rounded p-2 text-gray-900 bg-white"
                    value={report.status}
                    onChange={(e) => handleStatusChange(report.id, e.target.value as ReportStatus)}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

}
