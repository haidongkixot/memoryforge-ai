export default function AdminPlansPage() {
  const STATIC_PLANS = [
    { name: 'Free', price: '$0/mo', features: ['5 games/day', 'Basic analytics', 'Community support'], color: 'border-gray-700' },
    { name: 'Plus', price: '$9/mo', features: ['Unlimited games', 'Advanced analytics', 'AI coaching (10/day)', 'Priority support'], color: 'border-indigo-500/50' },
    { name: 'Pro', price: '$19/mo', features: ['Everything in Plus', 'Unlimited AI coaching', 'Custom training plans', 'Export data', 'Early access features'], color: 'border-purple-500/50' },
  ]

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Plans</h1>
        <p className="text-gray-400 text-sm mt-1">Subscription plan configuration for MemoryForge AI</p>
      </div>
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-400">
        ⚠️ Plans are currently static. Add the Plan model to prisma/schema.prisma and run a migration to enable dynamic plan management.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATIC_PLANS.map(plan => (
          <div key={plan.name} className={`bg-gray-900 border rounded-xl p-6 ${plan.color}`}>
            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
            <p className="text-2xl font-bold text-indigo-400 mt-2">{plan.price}</p>
            <div className="mt-4 space-y-2">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-indigo-400">✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
