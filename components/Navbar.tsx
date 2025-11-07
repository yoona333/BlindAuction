'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routes } from '@/constants/routes'
import { useIsOwner } from '@/hooks/useIsOwner'

/**
 * @title 导航栏组件
 * @description 提供网站主导航和钱包连接功能
 */
export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isOwner } = useIsOwner()

  // 导航链接配置
  const navLinks = [
    {
      label: '概览',
      href: routes.OVERVIEW.path,
      icon: '📊',
    },
    {
      label: '拍卖',
      href: routes.AUCTION.path,
      icon: '🔨',
    },
    {
      label: '创建拍卖',
      href: routes.CREATE_AUCTION.path,
      icon: '➕',
    },
    {
      label: '我的状态',
      href: routes.MYSTATUS.path,
      icon: '👤',
    },
    {
      label: '结果',
      href: routes.RESULT.path,
      icon: '📋',
    },
    // Owner 专用链接
    ...(isOwner
      ? [
          {
            label: '管理',
            href: routes.ADMIN.path,
            icon: '👑',
          },
        ]
      : []),
  ]

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo 和标题 */}
          <Link 
            href={routes.HOME.path} 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="text-2xl">🔒</span>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Blind Auction
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                加密拍卖平台
              </p>
            </div>
          </Link>

          {/* 桌面端导航链接 */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }
                  `}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* 右侧操作区：钱包连接按钮和移动端菜单 */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* 钱包连接按钮 - 始终显示 */}
            <div className="flex-shrink-0 relative z-10">
              <appkit-button />
            </div>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="菜单"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 移动端导航菜单（可展开/收起） */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-zinc-200 dark:border-zinc-800 mt-2 pt-4 animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }
                    `}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

