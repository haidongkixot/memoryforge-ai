export default function AdminCmsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Blog / CMS</h1>
        <p className="text-gray-400 text-sm mt-1">Content management and blog posts</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-xl font-bold text-white mb-2">Content Management</h2>
        <p className="text-gray-400 mb-6 max-w-sm mx-auto">Blog CMS requires the BlogPost model. Add it to the schema and migrate to enable content creation.</p>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-left max-w-sm mx-auto">
          <p className="text-xs text-gray-400 font-mono">npx prisma migrate dev --name add-blog-cms</p>
        </div>
      </div>
    </div>
  )
}
