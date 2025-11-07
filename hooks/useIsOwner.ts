'use client'

import { useAccount } from 'wagmi'
import { useOwner } from './useBlindAuction'

/**
 * @title 检查当前用户是否为 Owner
 * @description 比较当前连接的钱包地址与合约 Owner 地址
 * @returns { isOwner: boolean, isLoading: boolean, ownerAddress: string | undefined }
 */
export function useIsOwner() {
  const { address: currentAddress } = useAccount()
  const { data: ownerAddress, isLoading } = useOwner()

  // 确保类型安全：将 ownerAddress 转换为字符串类型
  const ownerAddressStr = ownerAddress as `0x${string}` | undefined
  const currentAddressStr = currentAddress as `0x${string}` | undefined

  const isOwner =
    ownerAddressStr &&
    currentAddressStr &&
    typeof ownerAddressStr === 'string' &&
    typeof currentAddressStr === 'string' &&
    ownerAddressStr.toLowerCase() === currentAddressStr.toLowerCase()

  return {
    isOwner: !!isOwner,
    isLoading,
    ownerAddress: ownerAddressStr,
    currentAddress: currentAddressStr,
  }
}

