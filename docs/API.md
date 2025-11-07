# 智能合约接口文档

本文档描述了前端需要对接的三个智能合约的接口规范。

## 目录

- [BlindAuction 合约](#blindauction-合约)
- [MockERC721 合约](#mockerc721-合约)
- [MySecretToken 合约](#mysecrettoken-合约)

---


盲拍合约，支持使用全同态加密（FHE）进行加密出价。

### 合约地址

```typescript
const BLIND_AUCTION_ADDRESS = process.env.NEXT_PUBLIC_BLIND_AUCTION_ADDRESS
```

### 只读函数（View Functions）

#### 1. `auctionStartTime()`

获取拍卖开始时间。

**返回值：**
- `uint256` - 拍卖开始时间戳（Unix 时间戳，秒）

**示例：**
```typescript
const startTime = await contract.read.auctionStartTime()
```

---

#### 2. `auctionEndTime()`

获取拍卖结束时间。

**返回值：**
- `uint256` - 拍卖结束时间戳（Unix 时间戳，秒）

**示例：**
```typescript
const endTime = await contract.read.auctionEndTime()
```

---

#### 3. `beneficiary()`

获取受益人地址（拍卖发起人）。

**返回值：**
- `address` - 受益人地址

**示例：**
```typescript
const beneficiary = await contract.read.beneficiary()
```

---

#### 4. `tokenId()`

获取拍卖的 NFT Token ID。

**返回值：**
- `uint256` - NFT Token ID

**示例：**
```typescript
const tokenId = await contract.read.tokenId()
```

---

#### 5. `isNftClaimed()`

检查 NFT 是否已被领取。

**返回值：**
- `bool` - `true` 表示已领取，`false` 表示未领取

**示例：**
```typescript
const claimed = await contract.read.isNftClaimed()
```

---

#### 6. `getWinnerAddress()`

获取获胜者地址（仅在拍卖结束且已解密后可用）。

**返回值：**
- `address` - 获胜者地址

**错误：**
- `WinnerNotYetRevealed` - 如果获胜者地址尚未被解密

**示例：**
```typescript
const winner = await contract.read.getWinnerAddress()
```

---

#### 7. `winnerAddress()`

获取公开的获胜者地址（公共状态变量）。

**返回值：**
- `address` - 获胜者地址（如果未解密则为零地址）

**示例：**
```typescript
const winner = await contract.read.winnerAddress()
```

---

#### 8. `getEncryptedBid(address account)`

获取指定地址的加密出价。

**参数：**
- `account` (`address`) - 要查询的地址

**返回值：**
- `euint64` (`bytes32`) - 加密的出价金额

**示例：**
```typescript
const encryptedBid = await contract.read.getEncryptedBid(['0x...'])
```

---

#### 9. `nftContract()`

获取 NFT 合约地址。

**返回值：**
- `address` - NFT 合约地址

**示例：**
```typescript
const nftContract = await contract.read.nftContract()
```

---

#### 10. `confidentialFungibleToken()`

获取机密代币合约地址。

**返回值：**
- `address` - 机密代币合约地址

**示例：**
```typescript
const tokenContract = await contract.read.confidentialFungibleToken()
```

---

### 写入函数（Write Functions）

#### 1. `bid(externalEuint64 encryptedAmount, bytes inputProof)`

提交加密出价。

**参数：**
- `encryptedAmount` (`externalEuint64`, `bytes32`) - 加密的出价金额
- `inputProof` (`bytes`) - 输入证明（用于验证加密金额的有效性）

**错误：**
- `TooEarlyError` - 拍卖尚未开始
- `TooLateError` - 拍卖已结束

**示例：**
```typescript
await contract.write.bid({
  args: [encryptedAmount, inputProof]
})
```

**注意事项：**
- 需要在拍卖开始后、结束前调用
- `encryptedAmount` 需要使用 FHE SDK 加密
- `inputProof` 需要由 FHE Relayer 生成

---

#### 2. `decryptWinningAddress()`

解密获胜者地址（拍卖结束后调用）。

**错误：**
- `TooLateError` - 拍卖尚未结束
- `WinnerNotYetRevealed` - 解密请求尚未完成

**示例：**
```typescript
await contract.write.decryptWinningAddress()
```

**注意事项：**
- 只能在拍卖结束后调用
- 这是一个异步操作，需要等待 Relayer 处理
- 监听 `DecryptionFulfilled` 事件以确认解密完成

---

#### 3. `winnerClaimPrize()`

获胜者领取 NFT 奖品。

**错误：**
- `WinnerNotYetRevealed` - 获胜者尚未被解密
- 只有获胜者可以调用

**示例：**
```typescript
await contract.write.winnerClaimPrize()
```

**注意事项：**
- 只有获胜者可以调用
- 需要先调用 `decryptWinningAddress()` 并等待解密完成

---

#### 4. `withdraw(address bidder)`

出价者提取退款（未获胜者）。

**参数：**
- `bidder` (`address`) - 要提取退款的出价者地址

**示例：**
```typescript
await contract.write.withdraw({
  args: ['0x...']
})
```

**注意事项：**
- 只有未获胜的出价者可以提取退款
- 需要在拍卖结束且获胜者已确定后调用

---

### 事件（Events）

#### `DecryptionFulfilled(uint256 requestID)`

当解密请求完成时触发。

**参数：**
- `requestID` (`uint256`) - 解密请求 ID

**示例：**
```typescript
contract.on('DecryptionFulfilled', (requestID) => {
  console.log('Decryption completed:', requestID)
})
```

---

## MockERC721 合约

ERC721 NFT 合约，用于创建和管理 NFT。

### 合约地址

需要从部署脚本或配置中获取。

### 只读函数（View Functions）

#### 1. `name()`

获取代币名称。

**返回值：**
- `string` - 代币名称

**示例：**
```typescript
const name = await contract.read.name()
```

---

#### 2. `symbol()`

获取代币符号。

**返回值：**
- `string` - 代币符号

**示例：**
```typescript
const symbol = await contract.read.symbol()
```

---

#### 3. `tokenURI(uint256 tokenId)`

获取指定 Token ID 的 URI。

**参数：**
- `tokenId` (`uint256`) - Token ID

**返回值：**
- `string` - Token URI

**示例：**
```typescript
const uri = await contract.read.tokenURI([tokenId])
```

---

#### 4. `balanceOf(address owner)`

获取指定地址的 NFT 余额。

**参数：**
- `owner` (`address`) - 要查询的地址

**返回值：**
- `uint256` - NFT 数量

**示例：**
```typescript
const balance = await contract.read.balanceOf(['0x...'])
```

---

#### 5. `ownerOf(uint256 tokenId)`

获取指定 Token ID 的所有者。

**参数：**
- `tokenId` (`uint256`) - Token ID

**返回值：**
- `address` - 所有者地址

**示例：**
```typescript
const owner = await contract.read.ownerOf([tokenId])
```

---

#### 6. `getApproved(uint256 tokenId)`

获取指定 Token ID 的授权地址。

**参数：**
- `tokenId` (`uint256`) - Token ID

**返回值：**
- `address` - 授权地址（如果未授权则为零地址）

**示例：**
```typescript
const approved = await contract.read.getApproved([tokenId])
```

---

#### 7. `isApprovedForAll(address owner, address operator)`

检查操作者是否被授权管理所有者的所有 NFT。

**参数：**
- `owner` (`address`) - 所有者地址
- `operator` (`address`) - 操作者地址

**返回值：**
- `bool` - `true` 表示已授权

**示例：**
```typescript
const approved = await contract.read.isApprovedForAll(['0x...', '0x...'])
```

---

#### 8. `supportsInterface(bytes4 interfaceId)`

检查合约是否支持指定的接口。

**参数：**
- `interfaceId` (`bytes4`) - 接口 ID

**返回值：**
- `bool` - `true` 表示支持

**示例：**
```typescript
const supports = await contract.read.supportsInterface(['0x...'])
```

---

### 写入函数（Write Functions）

#### 1. `mint(address to)`

铸造一个新的 NFT 给指定地址。

**参数：**
- `to` (`address`) - 接收 NFT 的地址

**返回值：**
- `uint256` - 新铸造的 Token ID

**示例：**
```typescript
const tokenId = await contract.write.mint({
  args: ['0x...']
})
```

---

#### 2. `batchMint(address to, uint256 amount)`

批量铸造 NFT。

**参数：**
- `to` (`address`) - 接收 NFT 的地址
- `amount` (`uint256`) - 要铸造的数量

**示例：**
```typescript
await contract.write.batchMint({
  args: ['0x...', 10]
})
```

---

#### 3. `approve(address to, uint256 tokenId)`

授权指定地址使用指定的 NFT。

**参数：**
- `to` (`address`) - 被授权的地址
- `tokenId` (`uint256`) - Token ID

**示例：**
```typescript
await contract.write.approve({
  args: ['0x...', tokenId]
})
```

---

#### 4. `setApprovalForAll(address operator, bool approved)`

授权或取消授权操作者管理所有者的所有 NFT。

**参数：**
- `operator` (`address`) - 操作者地址
- `approved` (`bool`) - `true` 表示授权，`false` 表示取消授权

**示例：**
```typescript
await contract.write.setApprovalForAll({
  args: ['0x...', true]
})
```

---

#### 5. `transferFrom(address from, address to, uint256 tokenId)`

转移 NFT（需要授权）。

**参数：**
- `from` (`address`) - 发送方地址
- `to` (`address`) - 接收方地址
- `tokenId` (`uint256`) - Token ID

**示例：**
```typescript
await contract.write.transferFrom({
  args: ['0x...', '0x...', tokenId]
})
```

---

#### 6. `safeTransferFrom(address from, address to, uint256 tokenId)`

安全转移 NFT（会检查接收方是否支持 ERC721）。

**参数：**
- `from` (`address`) - 发送方地址
- `to` (`address`) - 接收方地址
- `tokenId` (`uint256`) - Token ID

**示例：**
```typescript
await contract.write.safeTransferFrom({
  args: ['0x...', '0x...', tokenId]
})
```

---

#### 7. `safeTransferFrom(address from, address to, uint256 tokenId, bytes data)`

安全转移 NFT（带数据）。

**参数：**
- `from` (`address`) - 发送方地址
- `to` (`address`) - 接收方地址
- `tokenId` (`uint256`) - Token ID
- `data` (`bytes`) - 附加数据

**示例：**
```typescript
await contract.write.safeTransferFrom({
  args: ['0x...', '0x...', tokenId, '0x...']
})
```

---

### 事件（Events）

#### `Transfer(address indexed from, address indexed to, uint256 indexed tokenId)`

当 NFT 转移时触发。

#### `Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)`

当 NFT 被授权时触发。

#### `ApprovalForAll(address indexed owner, address indexed operator, bool approved)`

当操作者授权状态改变时触发。





---

## MySecretToken 合约

机密代币合约，支持全同态加密的机密转账。

### 合约地址

需要从部署脚本或配置中获取。

### 只读函数（View Functions）

#### 1. `name()`

获取代币名称。

**返回值：**
- `string` - 代币名称

**示例：**
```typescript
const name = await contract.read.name()
```

---

#### 2. `symbol()`

获取代币符号。

**返回值：**
- `string` - 代币符号

**示例：**
```typescript
const symbol = await contract.read.symbol()
```

---

#### 3. `decimals()`

获取代币精度。

**返回值：**
- `uint8` - 代币精度（通常为 18）

**示例：**
```typescript
const decimals = await contract.read.decimals()
```

---

#### 4. `tokenURI()`

获取代币 URI。

**返回值：**
- `string` - Token URI

**示例：**
```typescript
const uri = await contract.read.tokenURI()
```

---

#### 5. `confidentialBalanceOf(address account)`

获取指定地址的加密余额。

**参数：**
- `account` (`address`) - 要查询的地址

**返回值：**
- `euint64` (`bytes32`) - 加密的余额

**示例：**
```typescript
const encryptedBalance = await contract.read.confidentialBalanceOf(['0x...'])
```

---

#### 6. `confidentialTotalSupply()`

获取加密的总供应量。

**返回值：**
- `euint64` (`bytes32`) - 加密的总供应量

**示例：**
```typescript
const encryptedSupply = await contract.read.confidentialTotalSupply()
```

---

#### 7. `isOperator(address holder, address spender)`

检查操作者是否被授权。

**参数：**
- `holder` (`address`) - 持有者地址
- `spender` (`address`) - 操作者地址

**返回值：**
- `bool` - `true` 表示已授权

**示例：**
```typescript
const isOp = await contract.read.isOperator(['0x...', '0x...'])
```

---

### 写入函数（Write Functions）

#### 1. `confidentialTransfer(address to, euint64 amount)`

机密转账（使用已加密的金额）。

**参数：**
- `to` (`address`) - 接收方地址
- `amount` (`euint64`, `bytes32`) - 加密的转账金额

**返回值：**
- `euint64` (`bytes32`) - 加密的转账金额

**示例：**
```typescript
const transferred = await contract.write.confidentialTransfer({
  args: ['0x...', encryptedAmount]
})
```

---

#### 2. `confidentialTransfer(address to, externalEuint64 encryptedAmount, bytes inputProof)`

机密转账（使用外部加密的金额，需要证明）。

**参数：**
- `to` (`address`) - 接收方地址
- `encryptedAmount` (`externalEuint64`, `bytes32`) - 外部加密的金额
- `inputProof` (`bytes`) - 输入证明

**返回值：**
- `euint64` (`bytes32`) - 加密的转账金额

**示例：**
```typescript
const transferred = await contract.write.confidentialTransfer({
  args: ['0x...', encryptedAmount, inputProof]
})
```

---

#### 3. `confidentialTransferFrom(address from, address to, euint64 amount)`

从指定地址机密转账（需要授权）。

**参数：**
- `from` (`address`) - 发送方地址
- `to` (`address`) - 接收方地址
- `amount` (`euint64`, `bytes32`) - 加密的转账金额

**返回值：**
- `euint64` (`bytes32`) - 加密的转账金额

**示例：**
```typescript
const transferred = await contract.write.confidentialTransferFrom({
  args: ['0x...', '0x...', encryptedAmount]
})
```

---

#### 4. `confidentialTransferFrom(address from, address to, externalEuint64 encryptedAmount, bytes inputProof)`

从指定地址机密转账（使用外部加密金额，需要授权和证明）。

**参数：**
- `from` (`address`) - 发送方地址
- `to` (`address`) - 接收方地址
- `encryptedAmount` (`externalEuint64`, `bytes32`) - 外部加密的金额
- `inputProof` (`bytes`) - 输入证明

**返回值：**
- `euint64` (`bytes32`) - 加密的转账金额

**示例：**
```typescript
const transferred = await contract.write.confidentialTransferFrom({
  args: ['0x...', '0x...', encryptedAmount, inputProof]
})
```

---

#### 5. `confidentialTransferAndCall(...)`

机密转账并调用回调函数（多个重载版本）。

**参数：**
根据版本不同，参数包括：
- `to` (`address`) - 接收方地址
- `amount` (`euint64` 或 `externalEuint64`) - 加密的转账金额
- `data` (`bytes`) - 回调数据
- `inputProof` (`bytes`) - 输入证明（如果使用外部加密金额）

**示例：**
```typescript
await contract.write.confidentialTransferAndCall({
  args: ['0x...', encryptedAmount, callbackData]
})
```

---

#### 6. `setOperator(address operator, uint48 until)`

设置操作者授权。

**参数：**
- `operator` (`address`) - 操作者地址
- `until` (`uint48`) - 授权到期时间戳

**示例：**
```typescript
await contract.write.setOperator({
  args: ['0x...', expirationTimestamp]
})
```

---

#### 7. `discloseEncryptedAmount(euint64 encryptedAmount)`

披露加密金额（请求解密）。

**参数：**
- `encryptedAmount` (`euint64`, `bytes32`) - 要解密的加密金额

**示例：**
```typescript
await contract.write.discloseEncryptedAmount({
  args: [encryptedAmount]
})
```

---

#### 8. `finalizeDiscloseEncryptedAmount(uint256 requestId, uint64 amount, bytes[] signatures)`

完成加密金额披露（由 Relayer 调用）。

**参数：**
- `requestId` (`uint256`) - 请求 ID
- `amount` (`uint64`) - 解密后的金额
- `signatures` (`bytes[]`) - KMS 签名

**示例：**
```typescript
await contract.write.finalizeDiscloseEncryptedAmount({
  args: [requestId, amount, signatures]
})
```

---

### 事件（Events）

#### `ConfidentialTransfer(address indexed from, address indexed to, euint64 indexed amount)`

当机密转账发生时触发。

#### `AmountDisclosed(euint64 indexed encryptedAmount, uint64 amount)`

当加密金额被披露时触发。

#### `OperatorSet(address indexed holder, address indexed operator, uint48 until)`

当操作者授权被设置时触发。

#### `DecryptionFulfilled(uint256 indexed requestID)`

当解密请求完成时触发。

---

## 使用示例

### 完整的出价流程

```typescript
import { useAccount, useWriteContract } from 'wagmi'
import { BLIND_AUCTION_ADDRESS, BLIND_AUCTION_ABI } from '@/lib/contracts'
import { useRelayer } from '@/context'

function BidComponent() {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const { instance: relayer } = useRelayer()
  
  const handleBid = async (amount: bigint) => {
    if (!relayer || !address) return
    
    try {
      // 1. 使用 FHE SDK 加密出价金额
      const encryptedAmount = await relayer.encrypt64(amount)
      
      // 2. 生成输入证明
      const inputProof = await relayer.generateInputProof({
        amount: encryptedAmount,
        // ... 其他参数
      })
      
      // 3. 调用 bid 函数
      await writeContract({
        address: BLIND_AUCTION_ADDRESS,
        abi: BLIND_AUCTION_ABI,
        functionName: 'bid',
        args: [encryptedAmount, inputProof],
      })
    } catch (error) {
      console.error('Bid failed:', error)
    }
  }
  
  return (
    <button onClick={() => handleBid(BigInt(1000))}>
      Place Bid
    </button>
  )
}
```

---

### 查询拍卖信息

```typescript
import { useReadContract } from 'wagmi'
import { BLIND_AUCTION_ADDRESS, BLIND_AUCTION_ABI } from '@/lib/contracts'

function AuctionInfo() {
  const { data: startTime } = useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'auctionStartTime',
  })
  
  const { data: endTime } = useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'auctionEndTime',
  })
  
  const { data: winner } = useReadContract({
    address: BLIND_AUCTION_ADDRESS,
    abi: BLIND_AUCTION_ABI,
    functionName: 'getWinnerAddress',
  })
  
  return (
    <div>
      <p>Start: {startTime ? new Date(Number(startTime) * 1000).toLocaleString() : 'N/A'}</p>
      <p>End: {endTime ? new Date(Number(endTime) * 1000).toLocaleString() : 'N/A'}</p>
      <p>Winner: {winner || 'Not revealed yet'}</p>
    </div>
  )
}
```

---

## 注意事项

### FHE 相关

1. **加密操作**：所有涉及金额的操作都需要使用 FHE SDK 进行加密
2. **Relayer 依赖**：加密和解密操作需要 FHE Relayer 服务支持
3. **异步处理**：解密操作是异步的，需要监听事件确认完成

### 时间相关

1. **时间戳格式**：所有时间戳都是 Unix 时间戳（秒）
2. **时区处理**：前端显示时需要转换为本地时区

### 错误处理

1. **合约错误**：所有合约错误都会通过 revert 抛出，需要捕获并处理
2. **常见错误**：
   - `TooEarlyError` - 操作时间过早
   - `TooLateError` - 操作时间过晚
   - `WinnerNotYetRevealed` - 获胜者尚未解密
   - `ConfidentialFungibleTokenUnauthorizedCaller` - 未授权调用

### Gas 费用

1. **FHE 操作**：涉及 FHE 的操作通常需要更高的 Gas 费用
2. **批量操作**：考虑使用批量操作以减少 Gas 消耗

---

## 类型定义

```typescript
// 加密类型
type euint64 = `0x${string}` // bytes32
type externalEuint64 = `0x${string}` // bytes32

// 地址类型
type Address = `0x${string}`

// 时间戳类型
type Timestamp = bigint // uint256

// 金额类型
type Amount = bigint // uint256
```

---

## 相关资源

- [Wagmi 文档](https://wagmi.sh)
- [Viem 文档](https://viem.sh)
- [FHE Relayer SDK 文档](https://docs.zama.ai)

