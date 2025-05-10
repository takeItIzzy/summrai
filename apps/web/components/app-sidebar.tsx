'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { PlusCircle, MessageSquare, Settings } from 'lucide-react';
import { UserButton } from '@stackframe/stack';

export function AppSidebar() {
  // 最近对话列表
  const recentChats = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    title: `对话 ${i + 1}`,
    url: '#',
  }));

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">历史会话</h1>
        </div>
        <SidebarMenuButton
          asChild
          className="mt-4 h-12 w-2/3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/80 active:text-primary-foreground p-3 text-sm"
        >
          <button>
            <PlusCircle className="h-4 w-4" />
            <span>新对话</span>
          </button>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-sm">最近对话</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentChats.map(chat => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <a href={chat.url}>
                      <MessageSquare className="h-4 w-4" />
                      <span>{chat.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
