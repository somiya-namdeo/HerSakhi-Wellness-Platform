const UserStats = ({ stats }) => {
  const items = [
    { label: "Days Tracked", value: stats?.days_tracked || 0, colorClass: "text-[#a78bfa]" },
    { label: "Cycles Logged", value: stats?.cycles_logged || 0, colorClass: "text-pink-400" },
    { label: "Insights Gained", value: stats?.insights_gained || 0, colorClass: "text-orange-400" }
  ]

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 mb-8">
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Your Stats</h3>

      <div className="space-y-4">
        {items.map((stat, index) => (
          <div key={index} className="bg-[#fdf7fb] rounded-2xl p-5 border border-primary/5">
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-poppins font-semibold ${stat.colorClass}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserStats
