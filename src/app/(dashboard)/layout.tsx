import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/server-session";

// Every page inside (dashboard) requires a signed-in user.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <DashboardShell user={user}>{children}</DashboardShell>;
}