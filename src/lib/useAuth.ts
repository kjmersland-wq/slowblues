import { useEffect, useState } from "react";
import { getAdminSession } from "@/lib/adminAuth.server";

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAdminSession()
      .then(({ isAdmin: next }) => {
        if (active) setIsAdmin(next);
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { isAdmin, loading };
}
