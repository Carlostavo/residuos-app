
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAllowed(false);
        return;
      }

      // Fetch role from custom claim or user_roles table
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!error && data && allowedRoles.includes(data.role)) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    }

    checkRole();
  }, [allowedRoles]);

  if (!isAllowed) return null;

  return children;
}
