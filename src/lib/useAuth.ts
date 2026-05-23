import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

async function checkAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) {
    console.warn("[useAuth] role lookup failed", error);
    return false;
  }
  return (data ?? []).some((r: { role: string }) => r.role === "admin");
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const syncSession = async (nextSession: Session | null) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      const nextIsAdmin = await checkAdmin(nextSession.user.id);
      if (!active) return;
      setIsAdmin(nextIsAdmin);
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      void syncSession(s);
    });

    supabase.auth.getSession().then(({ data }) => {
      void syncSession(data.session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user, isAdmin, loading };
}
