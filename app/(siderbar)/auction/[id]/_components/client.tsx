'use client'

type Props = {
  auctionId: string
}

export function AuctionDetailClient({ auctionId }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Auction Detail</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Auction ID: {auctionId}
      </p>
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
        This page is under construction.
      </p>
    </div>
  )
}

