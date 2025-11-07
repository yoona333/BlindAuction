import BlindAuctionAbi from '@/contracts/BlindAuction.json'

/**
 * @title BlindAuction 合约配置
 * @notice 包含合约地址、ABI 和所有函数/事件/错误的定义
 */

// ========== 合约地址 ==========
/**
 * BlindAuction 合约地址
 * 从环境变量 NEXT_PUBLIC_BLIND_AUCTION_ADDRESS 读取，部署后需要更新
 */
export const BLIND_AUCTION_ADDRESS = process.env.NEXT_PUBLIC_BLIND_AUCTION_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000'

// ========== 合约 ABI ==========
/**
 * BlindAuction 合约 ABI
 */
export const BLIND_AUCTION_ABI = BlindAuctionAbi.abi

// ========== 读函数（View Functions）==========
/**
 * 读函数名称常量
 * 用于类型安全和代码提示
 */
export const BLIND_AUCTION_READ_FUNCTIONS = {
  // 拍卖查询
  getAuction: 'getAuction',
  getWinnerAddress: 'getWinnerAddress',
  getEncryptedBid: 'getEncryptedBid',
  
  // 用户映射查询
  getUserCreatedAuctions: 'getUserCreatedAuctions',
  getUserCreatedAuctionsCount: 'getUserCreatedAuctionsCount',
  getUserBidAuctions: 'getUserBidAuctions',
  getUserBidAuctionsCount: 'getUserBidAuctionsCount',
  
  // 合约状态
  nextAuctionId: 'nextAuctionId',
  owner: 'owner',
  confidentialFungibleToken: 'confidentialFungibleToken',
  
  // 手续费常量
  FEE_PERCENTAGE: 'FEE_PERCENTAGE',
  FEE_DENOMINATOR: 'FEE_DENOMINATOR',
  
  // 拍卖映射（通过 auctionId 访问）
  auctions: 'auctions',
} as const

// ========== 写函数（Write Functions）==========
/**
 * 写函数名称常量
 * 用于类型安全和代码提示
 */
export const BLIND_AUCTION_WRITE_FUNCTIONS = {
  // 拍卖管理
  createAuction: 'createAuction',
  bid: 'bid',
  decryptWinningAddress: 'decryptWinningAddress',
  winnerClaimPrize: 'winnerClaimPrize',
  withdraw: 'withdraw',
  
  // Owner 功能
  withdrawFees: 'withdrawFees',
  
  // 预言机回调（通常由网关调用）
  resolveAuctionCallback: 'resolveAuctionCallback',
} as const

// ========== 事件（Events）==========
/**
 * 事件名称常量
 * 用于监听合约事件
 */
export const BLIND_AUCTION_EVENTS = {
  AuctionCreated: 'AuctionCreated',
  BidPlaced: 'BidPlaced',
  DecryptionFulfilled: 'DecryptionFulfilled',
  FeesWithdrawn: 'FeesWithdrawn',
} as const

// ========== 错误（Errors）==========
/**
 * 错误名称常量
 * 用于错误处理和类型安全
 */
export const BLIND_AUCTION_ERRORS = {
  AuctionNotFound: 'AuctionNotFound',
  OnlyOwner: 'OnlyOwner',
  TooEarlyError: 'TooEarlyError',
  TooLateError: 'TooLateError',
  WinnerNotYetRevealed: 'WinnerNotYetRevealed',
  ReentrancyGuardReentrantCall: 'ReentrancyGuardReentrantCall',
  HandlesAlreadySavedForRequestID: 'HandlesAlreadySavedForRequestID',
  InvalidKMSSignatures: 'InvalidKMSSignatures',
  NoHandleFoundForRequestID: 'NoHandleFoundForRequestID',
  UnsupportedHandleType: 'UnsupportedHandleType',
} as const

// ========== 函数参数类型定义 ==========
/**
 * createAuction 函数参数类型
 */
export interface CreateAuctionParams {
  imageUrl: string
  imageUrls: string[]
  title: string
  description: string
  category: string
  location: string
  auctionStartTime: bigint
  auctionEndTime: bigint
  encryptedFeeAmount: `0x${string}` // externalEuint64 (bytes32)
  encryptedReservePrice: `0x${string}` // externalEuint64 (bytes32)
  encryptedDeposit: `0x${string}` // externalEuint64 (bytes32)
  inputProof: `0x${string}` // bytes
}

/**
 * bid 函数参数类型
 */
export interface BidParams {
  auctionId: bigint
  encryptedAmount: `0x${string}` // externalEuint64 (bytes32)
  inputProof: `0x${string}` // bytes
}

/**
 * getAuction 返回值类型
 */
export interface AuctionInfo {
  beneficiaryAddr: `0x${string}`
  imageUrl: string
  imageUrls: string[]
  title: string
  description: string
  category: string
  location: string
  startTime: bigint
  endTime: bigint
  winner: `0x${string}`
  claimed: boolean
}

// ========== 事件参数类型定义 ==========
/**
 * AuctionCreated 事件参数
 */
export interface AuctionCreatedEvent {
  auctionId: bigint
  beneficiary: `0x${string}`
  imageUrl: string
  title: string
  startTime: bigint
  endTime: bigint
}

/**
 * BidPlaced 事件参数
 */
export interface BidPlacedEvent {
  auctionId: bigint
  bidder: `0x${string}`
}

/**
 * FeesWithdrawn 事件参数
 */
export interface FeesWithdrawnEvent {
  owner: `0x${string}`
  amount: bigint
}

// ========== 兼容性导出（向后兼容）==========
/**
 * @deprecated 使用 BLIND_AUCTION_READ_FUNCTIONS 和 BLIND_AUCTION_WRITE_FUNCTIONS 代替
 * 保留此导出以保持向后兼容性
 */
export const BLIND_AUCTION_FUNCTIONS = {
  // 读函数
  ...BLIND_AUCTION_READ_FUNCTIONS,
  // 写函数
  ...BLIND_AUCTION_WRITE_FUNCTIONS,
} as const
