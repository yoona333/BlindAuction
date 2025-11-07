'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useRelayer } from '@/context/providers/relayer-context'
import { useCreateAuction } from '@/hooks/useBlindAuctionWrite'
import { useFeePercentage, useFeeDenominator } from '@/hooks/useBlindAuction'
import ProtectedRoute from '@/components/ProtectedRoute'
import { routes } from '@/constants/routes'
import Link from 'next/link'

/**
 * @title 创建拍卖页面
 * @description 创建新的拍卖项目，需要连接钱包和 FHE 加密
 */

// 拍卖类别选项
const AUCTION_CATEGORIES = [
  { value: '房产', label: '🏠 房产' },
  { value: '艺术品', label: '🎨 艺术品' },
  { value: '车辆', label: '🚗 车辆' },
  { value: '电子', label: '📱 电子' },
  { value: '文物', label: '📚 文物' },
  { value: '珠宝', label: '💎 珠宝' },
  { value: '音乐', label: '🎵 音乐' },
  { value: '书籍', label: '📖 书籍' },
  { value: '其他', label: '📦 其他' },
] as const

export default function CreateAuctionPage() {
  return (
    <ProtectedRoute requiredRole="authenticated">
      <CreateAuctionContent />
    </ProtectedRoute>
  )
}

function CreateAuctionContent() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { instance } = useRelayer()
  const { data: feePercentage } = useFeePercentage()
  const { data: feeDenominator } = useFeeDenominator()
  const { createAuction, isPending, isConfirming, isConfirmed, error, hash } =
    useCreateAuction()

  // 表单状态
  const [formData, setFormData] = useState({
    imageUrl: '',
    imageUrls: [] as string[],
    title: '',
    description: '',
    category: '',
    location: '',
    reservePrice: '',
    deposit: '',
    startTime: '',
    endTime: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isEncrypting, setIsEncrypting] = useState(false)

  // 计算手续费
  const feeAmount =
    formData.reservePrice &&
    feePercentage !== undefined &&
    feePercentage !== null &&
    feeDenominator !== undefined &&
    feeDenominator !== null
      ? (
          (BigInt(Math.floor(parseFloat(formData.reservePrice) * 1e18)) *
            BigInt(Number(feePercentage))) /
          BigInt(Number(feeDenominator))
        ) /
          BigInt(1e18)
      : BigInt(0)

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = '请上传主图'
    }
    if (!formData.title.trim()) {
      newErrors.title = '请输入标题'
    }
    if (formData.title.length > 100) {
      newErrors.title = '标题不能超过100个字符'
    }
    if (!formData.category) {
      newErrors.category = '请选择类别'
    }
    if (!formData.reservePrice || parseFloat(formData.reservePrice) <= 0) {
      newErrors.reservePrice = '请输入有效的起拍价'
    }
    if (!formData.deposit || parseFloat(formData.deposit) < 0) {
      newErrors.deposit = '请输入有效的保证金'
    }
    if (!formData.startTime) {
      newErrors.startTime = '请选择开始时间'
    }
    if (!formData.endTime) {
      newErrors.endTime = '请选择结束时间'
    }
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime).getTime()
      const end = new Date(formData.endTime).getTime()
      if (end <= start) {
        newErrors.endTime = '结束时间必须晚于开始时间'
      }
      if (start < Date.now()) {
        newErrors.startTime = '开始时间不能早于当前时间'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!isConnected || !address) {
      alert('请先连接钱包')
      return
    }

    if (!instance) {
      alert('FHE SDK 未初始化，请稍候再试')
      return
    }

    try {
      setIsEncrypting(true)

      // 转换时间
      const startTime = BigInt(Math.floor(new Date(formData.startTime).getTime() / 1000))
      const endTime = BigInt(Math.floor(new Date(formData.endTime).getTime() / 1000))

      // 转换金额（假设以 wei 为单位，1 ETH = 10^18 wei）
      const reservePriceWei = BigInt(Math.floor(parseFloat(formData.reservePrice) * 1e18))
      const depositWei = BigInt(Math.floor(parseFloat(formData.deposit) * 1e18))
      const feeAmountWei = feeAmount * BigInt(1e18)

      // 使用 FHE SDK 加密金额
      const encryptedReservePrice = await instance.encrypt64(reservePriceWei)
      const encryptedDeposit = await instance.encrypt64(depositWei)
      const encryptedFeeAmount = await instance.encrypt64(feeAmountWei)

      // 生成 inputProof
      // 根据合约 ABI，createAuction 函数需要一个 inputProof (bytes) 参数
      // 这个证明用于验证加密金额的有效性
      // 通常需要为手续费生成证明，因为这是用户实际需要支付的金额
      // 如果合约需要为所有加密值生成证明，可能需要生成多个证明并组合
      let inputProof: `0x${string}`
      
      try {
        // 使用 relayer 生成输入证明
        // generateInputProof 用于证明加密金额的有效性
        // 参数说明：
        // - amount: 要证明的加密金额（这里使用手续费，因为这是用户支付的金额）
        const proof = await instance.generateInputProof({
          amount: encryptedFeeAmount,
        })
        inputProof = proof as `0x${string}`
        
        // 验证证明是否有效
        if (!inputProof || inputProof === '0x') {
          throw new Error('生成的 inputProof 为空')
        }
      } catch (proofError) {
        console.error('生成 inputProof 失败:', proofError)
        throw new Error(
          '无法生成输入证明。请确保 FHE Relayer 服务正常运行。' +
          (proofError instanceof Error ? `错误详情: ${proofError.message}` : '')
        )
      }

      // 调用合约创建拍卖
      createAuction({
        imageUrl: formData.imageUrl,
        imageUrls: formData.imageUrls,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        auctionStartTime: startTime,
        auctionEndTime: endTime,
        encryptedFeeAmount: encryptedFeeAmount as `0x${string}`,
        encryptedReservePrice: encryptedReservePrice as `0x${string}`,
        encryptedDeposit: encryptedDeposit as `0x${string}`,
        inputProof: inputProof as `0x${string}`,
      })
    } catch (err) {
      console.error('创建拍卖失败:', err)
      alert('创建拍卖失败: ' + (err instanceof Error ? err.message : '未知错误'))
    } finally {
      setIsEncrypting(false)
    }
  }

  // 交易成功后跳转
  useEffect(() => {
    if (isConfirmed) {
      router.push(routes.AUCTION.path)
    }
  }, [isConfirmed, router])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href={routes.AUCTION.path}
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4 inline-block"
        >
          ← 返回拍卖列表
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          ➕ 创建拍卖
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          填写拍卖信息，创建新的拍卖项目
        </p>
      </div>

      {!isConnected && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            ⚠️ 请先连接钱包以创建拍卖
          </p>
        </div>
      )}

      {!instance && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-blue-800 dark:text-blue-200">
            ⏳ FHE SDK 正在初始化，请稍候...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            基本信息
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${
                  errors.title
                    ? 'border-red-500'
                    : 'border-zinc-300 dark:border-zinc-600'
                }`}
                placeholder="输入拍卖标题"
                maxLength={100}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                placeholder="输入详细描述"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  类别 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${
                    errors.category
                      ? 'border-red-500'
                      : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                >
                  <option value="">请选择类别</option>
                  {AUCTION_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  位置
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  placeholder="输入位置信息"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 图片上传 */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            图片
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                主图 URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${
                  errors.imageUrl
                    ? 'border-red-500'
                    : 'border-zinc-300 dark:border-zinc-600'
                }`}
                placeholder="https://example.com/image.jpg 或 ipfs://..."
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
              )}
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="预览"
                  className="mt-2 max-w-xs rounded-lg border border-zinc-300 dark:border-zinc-600"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                其他图片 URL（每行一个）
              </label>
              <textarea
                value={formData.imageUrls.join('\n')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    imageUrls: e.target.value
                      .split('\n')
                      .filter((url) => url.trim()),
                  })
                }
                rows={3}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                placeholder="https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
              />
            </div>
          </div>
        </div>

        {/* 拍卖设置 */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            拍卖设置
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  开始时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${
                    errors.startTime
                      ? 'border-red-500'
                      : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  结束时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${
                    errors.endTime
                      ? 'border-red-500'
                      : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  起拍价 (ETH) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.reservePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, reservePrice: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${
                    errors.reservePrice
                      ? 'border-red-500'
                      : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                  placeholder="0.0"
                />
                {errors.reservePrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.reservePrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  保证金 (ETH) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.deposit}
                  onChange={(e) =>
                    setFormData({ ...formData, deposit: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${
                    errors.deposit
                      ? 'border-red-500'
                      : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                  placeholder="0.0"
                />
                {errors.deposit && (
                  <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>
                )}
              </div>
            </div>

            {feeAmount > BigInt(0) && (
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  手续费（10%）：
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 ml-2">
                    {(Number(feeAmount) / 1e18).toFixed(6)} ETH
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              错误: {error.message || '创建拍卖失败'}
            </p>
          </div>
        )}

        {/* 提交按钮 */}
        <div className="flex gap-4">
          <Link
            href={routes.AUCTION.path}
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={isPending || isConfirming || isEncrypting || !isConnected || !instance}
            className="flex-1 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEncrypting
              ? '加密中...'
              : isPending
                ? '等待确认...'
                : isConfirming
                  ? '确认中...'
                  : '创建拍卖'}
          </button>
        </div>

        {/* 交易哈希 */}
        {hash && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              交易已提交: {hash}
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
