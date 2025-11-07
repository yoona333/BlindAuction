import BlindAuctionAbi from '@/contracts/BlindAuction.json'

// 合约地址 - 部署后需要更新
export const BLIND_AUCTION_ADDRESS = process.env.NEXT_PUBLIC_BLIND_AUCTION_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000'

// 合约 ABI
export const BLIND_AUCTION_ABI = BlindAuctionAbi.abi

// 合约函数选择器
export const BLIND_AUCTION_FUNCTIONS = {
  // 读函数
  getWinnerAddress: 'getWinnerAddress',
  auctionStartTime: 'auctionStartTime',
  auctionEndTime: 'auctionEndTime',
  beneficiary: 'beneficiary',
  tokenId: 'tokenId',
  winnerAddress: 'winnerAddress',
  isNftClaimed: 'isNftClaimed',
  getEncryptedBid: 'getEncryptedBid',
  nftContract: 'nftContract',
  confidentialFungibleToken: 'confidentialFungibleToken',
  
  // 写函数
  bid: 'bid',
  decryptWinningAddress: 'decryptWinningAddress',
  winnerClaimPrize: 'winnerClaimPrize',
  withdraw: 'withdraw',
} as const

