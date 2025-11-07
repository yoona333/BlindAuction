'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { BLIND_AUCTION_ADDRESS, BLIND_AUCTION_ABI } from '@/lib/contracts'

/**
 * Hook to place a bid in the blind auction
 * Note: This requires encrypted amount and input proof from FHE library
 */
export function usePlaceBid() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const placeBid = (encryptedAmount: `0x${string}`, inputProof: `0x${string}`) => {
    writeContract({
      address: BLIND_AUCTION_ADDRESS,
      abi: BLIND_AUCTION_ABI,
      functionName: 'bid',
      args: [encryptedAmount, inputProof],
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
 * Hook to decrypt the winning address after auction ends
 */
export function useDecryptWinningAddress() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const decryptWinningAddress = () => {
    writeContract({
      address: BLIND_AUCTION_ADDRESS,
      abi: BLIND_AUCTION_ABI,
      functionName: 'decryptWinningAddress',
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
 * Hook for winner to claim the NFT prize
 */
export function useClaimPrize() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const claimPrize = () => {
    writeContract({
      address: BLIND_AUCTION_ADDRESS,
      abi: BLIND_AUCTION_ABI,
      functionName: 'winnerClaimPrize',
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
 * Hook to withdraw bid after auction ends (for non-winners)
 */
export function useWithdrawBid() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const withdraw = (bidderAddress: `0x${string}`) => {
    writeContract({
      address: BLIND_AUCTION_ADDRESS,
      abi: BLIND_AUCTION_ABI,
      functionName: 'withdraw',
      args: [bidderAddress],
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

