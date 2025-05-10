'use client';

import { UserButton } from '@stackframe/stack';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import Image from 'next/image';
import { PromptInputWithPdf } from '@/app/components/prompt-input-with-pdf';

export default function Home() {
  return (
    <SidebarProvider>
      {/* 侧边栏 */}
      <AppSidebar />

      {/* 主内容区 */}
      <div className="flex flex-1 flex-col">
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900" />

          <div>
            <UserButton />
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="translate-y-[-64px]">
            {/* 消息区域 */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-end justify-center gap-4">
                <Image src="/logo.png" alt="logo" width={80} height={80} />
                <h1 className="text-2xl font-bold mb-2">嗨，我是 summrai</h1>
              </div>
              <p className="text-sm text-gray-500">今天需要我为你总结什么内容呢？</p>
            </div>

            {/* 输入区域 */}
            <div className="pt-8 p-4">
              <div className="max-w-3xl mx-auto">
                <PromptInputWithPdf />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
