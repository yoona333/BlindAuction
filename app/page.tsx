export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                🔒 Blind Auction
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Decentralized NFT Auction with Fully Homomorphic Encryption
              </p>
            </div>
            <appkit-button />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Welcome to Blind Auction
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Connect your wallet to get started
          </p>
        </div>
      </main>
    </div>
  );
}
