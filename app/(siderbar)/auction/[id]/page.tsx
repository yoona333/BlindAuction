import { AuctionDetailClient } from './_components/client'

type Props = {
  params: {
    id: string
  }
}

export default function AuctionDetailPage({ params }: Props) {
  return <AuctionDetailClient auctionId={params.id} />
}

