import { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | BMW 520D Luxury Rentals",
  description: "Rental owner management console to view and manage customer BMW 520D bookings, duty packages, and Google Sheets records.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
