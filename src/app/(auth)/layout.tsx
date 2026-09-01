import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - RFID Attendance System",
  description: "Sign in to the school RFID attendance portal.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
