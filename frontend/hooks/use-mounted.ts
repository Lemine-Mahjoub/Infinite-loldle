import { useEffect, useState } from "react";

/**
 * Custom hook to detect when component has mounted on the client side.
 * This prevents hydration mismatches when using browser-only APIs like localStorage.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
