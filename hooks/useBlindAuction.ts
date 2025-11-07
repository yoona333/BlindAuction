'use client'

import { useReadContract } from 'wagmi'
import { BLIND_AUCTION_ADDRESS, BLIND_AUCTION_ABI } from '@/lib/contracts'

/**
 * Hook to read the winner address from the BlindAuction contract
 */
export function useWinnerAddress() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'getWinnerAddress',
  })
}

/**
 * Hook to read auction start time
 */
export function useAuctionStartTime() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'auctionStartTime',
  })
}

/**
 * Hook to read auction end time
 */
export function useAuctionEndTime() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'auctionEndTime',
  })
}

/**
 * Hook to read beneficiary address
 */
export function useBeneficiary() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'beneficiary',
  })
}

/**
 * Hook to check if NFT has been claimed
 */
export function useIsNftClaimed() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'isNftClaimed',
  })
}

/**
 * Hook to read the token ID
 */
export function useTokenId() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'tokenId',
  })
}

/**
 * Hook to read the winner address (public state variable)
 */
export function usePublicWinnerAddress() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'winnerAddress',
  })
}

/**
 * Hook to read encrypted bid for a specific address
 */
export function useEncryptedBid(address?: `0x${string}`) {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'getEncryptedBid',
    args: address ? [address] : undefined,
  })
}

/**
 * Hook to read NFT contract address
 */
export function useNftContract() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'nftContract',
  })
}

/**
 * Hook to read confidential fungible token address
 */
export function useConfidentialToken() {
  return useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'confidentialFungibleToken',
  })
}

