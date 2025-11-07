'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import { routes } from '@/constants/routes'

/**
 * @title Owner 管理页面
 * @description 仅合约 Owner 可访问的管理面板
 */
export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="owner">
      <AdminContent />
    </ProtectedRoute>
  )
}

/**
 * 管理页面内容组件
 */
function AdminContent() {

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          👑 Owner 管理面板
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          管理所有拍卖、查看统计信息和提取手续费
        </p>
      </div>

      {/* 顶部操作栏 */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href={routes.CREATE_AUCTION.path}
          className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          ➕ 创建新拍卖
        </Link>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          💰 提取手续费
        </button>
        <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
          🔄 刷新数据
        </button>
      </div>

      {/* 统计信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            总拍卖数
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            --
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            进行中
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            --
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            已结束
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            --
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            累计手续费
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            -- ETH
          </div>
        </div>
      </div>

      {/* 手续费管理区域 */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700 mb-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          💰 手续费管理
        </h2>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              累计手续费
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              -- ETH
            </div>
          </div>
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              可提取金额
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              -- ETH
            </div>
          </div>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            提取全部手续费
          </button>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            ⚠️ 提取后手续费将转入您的钱包
          </p>
        </div>
      </div>

      {/* 拍卖管理区域 */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            📋 拍卖管理
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="搜索拍卖..."
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            />
            <select className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
              <option>全部状态</option>
              <option>进行中</option>
              <option>已结束</option>
            </select>
          </div>
        </div>

        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
          <p>拍卖列表功能正在开发中...</p>
          <p className="text-sm mt-2">
            将显示所有拍卖的详细信息和管理功能
          </p>
        </div>
      </div>
    </div>
  )
}

