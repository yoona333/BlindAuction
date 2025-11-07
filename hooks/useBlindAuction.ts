'use client'

import { useReadContract } from 'wagmi'
import { 
  BLIND_AUCTION_ADDRESS, 
  BLIND_AUCTION_ABI,
  BLIND_AUCTION_READ_FUNCTIONS,
  type AuctionInfo
} from '@/lib/contracts'

/**
 * @title BlindAuction 读函数 Hooks
 * @notice 提供所有读函数的 React Hooks
 */

// ========== 拍卖查询 Hooks ==========

/**
 * @notice 获取拍卖详情
 * @param auctionId 拍卖 ID
 * @returns 拍卖信息（受益人、图片、标题、描述、类别、位置、时间、获胜者、领取状态）
 */
export function useAuction(auctionId?: bigint) {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.getAuction,
    args: auctionId !== undefined ? [auctionId] : undefined,
    query: {
      enabled: auctionId !== undefined,
    },
  }) as {
    data?: AuctionInfo
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

/**
 * @notice 获取获胜者地址
 * @param auctionId 拍卖 ID
 * @returns 获胜者地址（仅在解密后可用）
 */
export function useWinnerAddress(auctionId?: bigint) {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.getWinnerAddress,
    args: auctionId !== undefined ? [auctionId] : undefined,
    query: {
      enabled: auctionId !== undefined,
    },
  })
}

/**
 * @notice 获取指定账户在指定拍卖中的加密出价
 * @param auctionId 拍卖 ID
 * @param account 账户地址
 * @returns 加密的出价金额（euint64，bytes32 格式）
 */
export function useEncryptedBid(auctionId?: bigint, account?: `0x${string}`) {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.getEncryptedBid,
    args: auctionId !== undefined && account !== undefined ? [auctionId, account] : undefined,
    query: {
      enabled: auctionId !== undefined && account !== undefined,
    },
  })
}

// ========== 用户映射查询 Hooks ==========

/**
 * @notice 获取用户创建的所有拍卖 ID
 * @param user 用户地址
 * @returns 用户创建的拍卖 ID 数组
 */
export function useUserCreatedAuctions(user?: `0x${string}`) {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.getUserCreatedAuctions,
    args: user !== undefined ? [user] : undefined,
    query: {
      enabled: user !== undefined,
    },
  }) as {
    data?: bigint[]
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

/**
 * @notice 获取用户创建的拍卖数量
 * @param user 用户地址
 * @returns 用户创建的拍卖数量
 */
export function useUserCreatedAuctionsCount(user?: `0x${string}`) {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.getUserCreatedAuctionsCount,
    args: user !== undefined ? [user] : undefined,
    query: {
      enabled: user !== undefined,
    },
  })
}

/**
 * @notice 获取用户出价的所有拍卖 ID
 * @param user 用户地址
 * @returns 用户出价的拍卖 ID 数组
 */
export function useUserBidAuctions(user?: `0x${string}`) {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.getUserBidAuctions,
    args: user !== undefined ? [user] : undefined,
    query: {
      enabled: user !== undefined,
    },
  }) as {
    data?: bigint[]
    isLoading: boolean
    error: Error | null
    refetch: () => void
  }
}

/**
 * @notice 获取用户出价的拍卖数量
 * @param user 用户地址
 * @returns 用户出价的拍卖数量
 */
export function useUserBidAuctionsCount(user?: `0x${string}`) {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.getUserBidAuctionsCount,
    args: user !== undefined ? [user] : undefined,
    query: {
      enabled: user !== undefined,
    },
  })
}

// ========== 合约状态 Hooks ==========

/**
 * @notice 获取下一个拍卖 ID（即当前拍卖总数）
 * @returns 下一个拍卖 ID
 */
export function useNextAuctionId() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.nextAuctionId,
  })
}

/**
 * @notice 获取合约所有者地址
 * @returns 所有者地址
 */
export function useOwner() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.owner,
  })
}

/**
 * @notice 获取机密代币合约地址
 * @returns 机密代币合约地址
 */
export function useConfidentialToken() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.confidentialFungibleToken,
  })
}

/**
 * @notice 获取手续费百分比（10% = 1000）
 * @returns 手续费百分比（基点）
 */
export function useFeePercentage() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.FEE_PERCENTAGE,
  })
}

/**
 * @notice 获取手续费分母（100% = 10000）
 * @returns 手续费分母（基点）
 */
export function useFeeDenominator() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.FEE_DENOMINATOR,
  })
}

// ========== 拍卖映射查询 Hooks ==========

/**
 * @notice 通过拍卖 ID 直接访问拍卖结构体
 * @param auctionId 拍卖 ID
 * @returns 拍卖结构体（包含所有字段，包括加密字段）
 * @note 返回的 reservePrice、deposit、highestBid、winningAddress 是加密的（bytes32）
 */
export function useAuctionStruct(auctionId?: bigint) {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: BLIND_AUCTION_READ_FUNCTIONS.auctions,
    args: auctionId !== undefined ? [auctionId] : undefined,
    query: {
      enabled: auctionId !== undefined,
    },
  })
}
