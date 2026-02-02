"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/admin/dashboard";

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Simple cookie check
    const cookies = document.cookie.split(';');
    const authToken = cookies.find(c => c.trim().startsWith('auth_token='));
    
    if (!authToken) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return null; // Or a loading spinner
  }

  return <AdminDashboard />;
}
