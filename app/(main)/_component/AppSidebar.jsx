"use client";
import { Calendar, Gem, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/context/useUser";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  // {
  //   title: "All Interview",
  //   url: "/all-interview",
  //   icon: Inbox,
  // },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, setUser } = useUserStore((state) => state);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel> */}
          <Image
            src={"/Interview.png"}
            height={80}
            className=" mix-blend-multiply mx-auto "
            width={80}
          />
          {/* </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              <Link href={"/create-interview"}>
                {" "}
                <Button className={"w-full my-4 cursor-pointer"}>
                  Create New Interview
                </Button>
              </Link>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={` ${
                      pathname === item.url ? " bg-gray-100 " : ""
                    } rounded-md py-1.5 `}
                    asChild
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2 p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gem className="h-4 w-4" />
            <span className="text-sm">{user?.credits} Credits Left</span>
          </div>
        </div>
        <Link href={"/buy-credits"} className="w-full ">
          <Button
            className={
              " bg-slate-200 w-full hover:bg-slate-300 text-black cursor-pointer "
            }
          >
            Buy Credits
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
