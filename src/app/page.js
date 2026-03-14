"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { Spinner } from "@/components/ui/Spinner";

export default function HomePage() {
  const { user, isInitializing } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && user) router.replace("/journal");
  }, [user, isInitializing]);

  if (isInitializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (user) return null;

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "85vh",
        padding: "40px 24px",
        flex: 1,
      }}
    >
      <LoginForm onSuccess={() => router.push("/journal")} />
    </main>
  );
}
