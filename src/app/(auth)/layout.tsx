/**
 * Auth pages layout.
 * Secara default menggunakan tema aurora untuk platform (Super Admin).
 * Namun, jika diakses melalui subdomain tenant, akan menggunakan tema tenant.
 */
"use client";

import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function applyTheme() {
      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "schoolpro.my.id";
      const host = window.location.hostname;
      
      if (host === rootDomain || host === `www.${rootDomain}` || host === "localhost") {
        // Main domain (Super Admin)
        document.documentElement.setAttribute("data-theme", "aurora");
      } else {
        // Subdomain (Tenant)
        const slug = host.split('.')[0];
        try {
          const res = await fetch(`/api/website/${slug}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.theme) {
              document.documentElement.setAttribute("data-theme", data.theme);
              return; // Successfully applied tenant theme
            }
          }
        } catch (error) {
          console.error("Failed to fetch tenant theme:", error);
        }
        
        // Fallback
        document.documentElement.setAttribute("data-theme", "aurora");
      }
    }
    
    applyTheme();
  }, []);

  return <>{children}</>;
}
