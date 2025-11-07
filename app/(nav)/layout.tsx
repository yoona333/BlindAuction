/**
 * @title 导航布局
 * @description 为所有 (nav) 路由组的页面提供统一的布局
 * @note 导航栏已在根布局中显示，这里只需要提供内容区域布局
 */
export default function NavLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  )
}

