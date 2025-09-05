import React from 'react'

const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600'
      case 'green': return 'bg-green-100 text-green-600'
      case 'orange': return 'bg-orange-100 text-orange-600'
      case 'red': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 transition hover:shadow-lg hover:border-gray-200 flex flex-col gap-3 min-w-[220px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-gray-500 tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        </div>
        <div className={`flex items-center justify-center p-3 rounded-full shrink-0 ${getColorClasses(color)}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-sm font-semibold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
            {trend}
          </span>
          <span className="text-xs text-gray-400">vs last period</span>
        </div>
      )}
    </div>
  )
}

export default StatCard