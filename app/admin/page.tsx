import { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Kalash BMW Cars",
  description: "Rental owner management console to view and manage customer Kalash BMW Cars bookings and Google Sheets records.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
