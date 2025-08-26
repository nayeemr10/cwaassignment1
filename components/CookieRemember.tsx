"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * On first load of "/", if a cookie 'lastNav' exists, navigate there.
 * Satisfies "Cookies – Remember which menu tab you were on."
 */
export default function CookieRemember() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    try {
      const m = document.cookie.match(/(?:^|; )lastNav=([^;]+)/);
      const last = m ? decodeURIComponent(m[1]) : null;
      if (last && last !== "/") router.replace(last);
    } catch {}
  }, [pathname, router]);

  return null;
}
