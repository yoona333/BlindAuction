'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useIsOwner } from '@/hooks/useIsOwner'
import { routes } from '@/constants/routes'

/**
 * @title 路由守卫组件
 * @description 根据权限控制页面访问，无权限时自动跳转
 */

interface ProtectedRouteProps {
  children: React.ReactNode
  /**
   * 需要的权限类型
   * - 'owner': 仅 Owner 可访问
   * - 'authenticated': 需要连接钱包
   * - 'public': 所有人可访问（默认）
   */
  requiredRole?: 'owner' | 'authenticated' | 'public'
  /**
   * 无权限时跳转的路由，默认为首页
   */
  redirectTo?: string
  /**
   * 加载中时显示的内容
   */
  loadingComponent?: React.ReactNode
  /**
   * 无权限时显示的内容（可选，如果不提供则直接跳转）
   */
  unauthorizedComponent?: React.ReactNode
}

/**
 * 路由守卫组件
 * 根据权限控制页面访问
 */
export default function ProtectedRoute({
  children,
  requiredRole = 'public',
  redirectTo = routes.HOME.path,
  loadingComponent,
  unauthorizedComponent,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { isOwner, isLoading: isOwnerLoading } = useIsOwner()
  const [hasRedirected, setHasRedirected] = useState(false)

  // 检查是否正在加载
  const isLoading = requiredRole === 'owner' ? isOwnerLoading : false

  useEffect(() => {
    // 如果还在加载中，不进行跳转
    if (isLoading) {
      return
    }

    // 如果已经跳转过，不再重复跳转
    if (hasRedirected) {
      return
    }

    let shouldRedirect = false

    // 检查权限
    if (requiredRole === 'owner') {
      if (!isOwner) {
        shouldRedirect = true
      }
    } else if (requiredRole === 'authenticated') {
      if (!isConnected || !address) {
        shouldRedirect = true
      }
    }

    // 如果需要跳转且没有提供自定义组件
    if (shouldRedirect && !unauthorizedComponent) {
      setHasRedirected(true)
      router.replace(redirectTo)
    }
  }, [
    isOwner,
    isConnected,
    address,
    isLoading,
    requiredRole,
    redirectTo,
    router,
    unauthorizedComponent,
    hasRedirected,
  ])

  // 加载中
  if (isLoading) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-zinc-600 dark:text-zinc-400">加载中...</div>
        </div>
      )
    )
  }

  // 权限检查
  if (requiredRole === 'owner' && !isOwner) {
    // 如果提供了自定义的无权限组件，显示它
    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>
    }
    // 否则显示默认提示（会在 useEffect 中跳转）
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-600 dark:text-zinc-400">跳转中...</div>
      </div>
    )
  }

  // 需要认证但未连接钱包
  if (requiredRole === 'authenticated' && (!isConnected || !address)) {
    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>
    }
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-600 dark:text-zinc-400">跳转中...</div>
      </div>
    )
  }

  // 有权限，显示内容
  return <>{children}</>
}

