import './globals.css';
import { StackProvider, StackTheme } from '@stackframe/stack';
import { stackServerApp } from '../stack';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SummRai - 智能内容摘要和分析平台',
  description: '使用SummRai快速获取关键信息，提高工作和学习效率',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className={cn(inter.className, 'bg-background text-foreground')}>
        <StackProvider app={stackServerApp}>
          <StackTheme>{children}</StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
