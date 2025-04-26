import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

const trendConfig = {
  up: {
    icon: ArrowUp,
    class: "text-green-500 bg-green-50",
    text: "Increasing",
  },
  down: {
    icon: ArrowDown,
    class: "text-red-500 bg-red-50",
    text: "Decreasing",
  },
  stable: {
    icon: ArrowRight,
    class: "text-blue-500 bg-blue-50",
    text: "Stable",
  },
}

export default function MetricCard({ 
  title, 
  value, 
  trend = "stable",
  previousValue,
  changePercentage,
  isLoading = false 
}) {
  const TrendIcon = trendConfig[trend]?.icon || ArrowRight
  const trendClass = trendConfig[trend]?.class || "text-blue-500 bg-blue-50"
  const trendText = trendConfig[trend]?.text || "Stable"

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 group hover:shadow-lg",
      isLoading && "animate-pulse"
    )}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-50" />
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

      <div className="relative p-6 space-y-4">
        {/* Title and trend indicator */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            trendClass
          )}>
            <TrendIcon className="w-3 h-3" />
            <span>{trendText}</span>
          </div>
        </div>

        {/* Main value */}
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            {isLoading ? "Loading..." : value}
          </div>
          
          {previousValue && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Previous: {previousValue}</span>
              {changePercentage && (
                <span className={cn(
                  "font-medium",
                  trend === "up" && "text-green-600",
                  trend === "down" && "text-red-600",
                  trend === "stable" && "text-blue-600"
                )}>
                  {changePercentage}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom indicator bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Card>
  )
}

// Example usage
export const MetricCardShowcase = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
    <MetricCard
      title="Temperature"
      value="24"
      unit="°C"
      icon={({ size, className }) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      )}
      color="bg-red-500"
    />
  </div>
);
