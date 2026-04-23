// /components/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import { Home, Users, Film } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Users", href: "/users", icon: Users },
    { name: "Movies", href: "/movies", icon: Film },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-2 text-lg font-bold">
            🎬 Recommender
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
                    active ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}