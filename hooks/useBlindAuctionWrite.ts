'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { 
  BLIND_AUCTION_ADDRESS, 
  BLIND_AUCTION_ABI,
  BLIND_AUCTION_WRITE_FUNCTIONS,
  type CreateAuctionParams,
  type BidParams
} from '@/lib/contracts'

/**
 * @title BlindAuction 写函数 Hooks
 * @notice 提供所有写函数的 React Hooks
 */

// ========== 拍卖管理 Hooks ==========

/**
 * @notice 创建新拍卖的 Hook
 * @description 任何人都可以创建拍卖，但需要支付 10% 手续费
 * @returns 创建拍卖的函数和交易状态
 */
export function useCreateAuction() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const createAuction = (params: CreateAuctionParams) => {
    writeContract({
      address: BLIND_AUCTION_ADDRESS,
      abi: BLIND_AUCTION_ABI,
      functionName: BLIND_AUCTION_WRITE_FUNCTIONS.createAuction,
      args: [
        params.imageUrl,
        params.imageUrls,
        params.title,
        params.description,
        params.category,
        params.location,
        params.auctionStartTime,
        params.auctionEndTime,
        params.encryptedFeeAmount,
        params.encryptedReservePrice,
        params.encryptedDeposit,
        params.inputProof,
      ],
    })
  }

  return {
    createAuction,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

/**
 * @notice 对拍卖出价的 Hook
 * @description 在拍卖进行期间可以出价，需要提供加密的出价金额
 * @returns 出价函数和交易状态
 */
export function usePlaceBid() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const placeBid = (params: BidParams) => {
    writeContract({
      address: BLIND_AUCTION_ADDRESS,
      abi: BLIND_AUCTION_ABI,
      functionName: BLIND_AUCTION_WRITE_FUNCTIONS.bid,
      args: [
        params.auctionId,
        params.encryptedAmount,
        params.inputProof,
      ],
    })
  }

  return {
    placeBid,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

/**
 * @notice 解密获胜者地址的 Hook
 * @description 拍卖结束后可以调用此函数来解密获胜者地址
 * @param auctionId 拍卖 ID
 * @returns 解密函数和交易状态
 */
export function useDecryptWinningAddress() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const decryptWinningAddress = (auctionId: bigint) => {
    writeContract({
      address: BLIND_AUCTION_ADDRESS,
      abi: BLIND_AUCTION_ABI,
      functionName: BLIND_AUCTION_WRITE_FUNCTIONS.decryptWinningAddress,
      args: [auctionId],
    })
  }

  return {
    decryptWinningAddress,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

/**
 * @notice 获胜者领取拍卖品的 Hook
 * @description 只有获胜者可以调用此函数来领取拍卖品
 * @param auctionId 拍卖 ID
 * @returns 领取函数和交易状态
 */
export function useClaimPrize() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const claimPrize = (auctionId: bigint) => {
    writeContract({
      address: BLIND_AUCTION_ADDRESS,
      abi: BLIND_AUCTION_ABI,
      functionName: BLIND_AUCTION_WRITE_FUNCTIONS.winnerClaimPrize,
      args: [auctionId],
    })
  }

  return {
    claimPrize,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

/**
 * @notice 提取出价的 Hook（非获胜者）
 * @description 拍卖结束后，非获胜者可以调用此函数来提取自己的出价
 * @returns 提取函数和交易状态
 */
export function useWithdrawBid() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const withdraw = (auctionId: bigint, bidderAddress: `0x${string}`) => {
    writeContract({
      address: BLIND_AUCTION_ADDRESS,
      abi: BLIND_AUCTION_ABI,
      functionName: BLIND_AUCTION_WRITE_FUNCTIONS.withdraw,
      args: [auctionId, bidderAddress],
    })
  }

  return {
    withdraw,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// ========== Owner 功能 Hooks ==========

/**
 * @notice 提取手续费的 Hook（仅 Owner）
 * @description 只有合约所有者可以调用此函数来提取累计的手续费
 * @returns 提取函数和交易状态
 */
export function useWithdrawFees() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const withdrawFees = () => {
    writeContract({
      address: BLIND_AUCTION_ADDRESS,
      abi: BLIND_AUCTION_ABI,
      functionName: BLIND_AUCTION_WRITE_FUNCTIONS.withdrawFees,
      args: [],
    })
  }

  return {
    withdrawFees,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}
