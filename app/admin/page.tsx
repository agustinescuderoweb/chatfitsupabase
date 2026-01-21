import InsightsPanel from "@/components/InsightsPanel";
import LogoutButton from "@/components/LogoutButton";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>

      <InsightsPanel />
    </div>
  );
}
