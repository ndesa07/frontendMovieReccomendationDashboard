"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-muted/40">
        <TooltipProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar />

              <main className="flex-1 p-6 w-full">
                <div className="w-full max-w-[1400px] mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}