"use client"

import { useState, useEffect } from "react"
import { Crown, Zap, Check } from "lucide-react"
import { pricingPlans, formatPrice, type PricingPlan } from "@/lib/pricing"
import { cn } from "@/lib/utils"

interface PlanSelectorProps {
  selectedPlan: string
  onPlanChange: (planId: string) => void
  billingInterval?: 'month' | 'year'
  onBillingChange?: (interval: 'month' | 'year') => void
}

export function PlanSelector({ 
  selectedPlan, 
  onPlanChange, 
  billingInterval = 'month',
  onBillingChange 
}: PlanSelectorProps) {
  const [interval, setInterval] = useState<'month' | 'year'>(billingInterval)

  const handleBillingChange = (newInterval: 'month' | 'year') => {
    setInterval(newInterval)
    onBillingChange?.(newInterval)
  }

  // Sync with external billing interval changes
  useEffect(() => {
    setInterval(billingInterval)
  }, [billingInterval])

  const getDisplayPrice = (plan: PricingPlan) => {
    return interval === 'year' ? plan.yearlyPrice || plan.price * 12 : plan.price
  }

  const getDisplayPeriod = () => {
    return interval === 'year' ? 'anno' : 'mese'
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'premium':
        return <Crown className="w-6 h-6 text-[#483cff]" />
      case 'elite':
        return <Zap className="w-6 h-6 text-[#483cff]" />
      default:
        return <Crown className="w-6 h-6 text-[#483cff]" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      {onBillingChange && (
        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => handleBillingChange('month')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                interval === 'month'
                  ? "bg-white text-[#483cff] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              Mensile
            </button>
            <button
              onClick={() => handleBillingChange('year')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                interval === 'year'
                  ? "bg-white text-[#483cff] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              Annuale
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Plan Selection */}
      <div className="grid gap-4 md:gap-6">
        {pricingPlans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          const displayPrice = getDisplayPrice(plan)
          
          return (
            <div
              key={plan.id}
              onClick={() => onPlanChange(plan.id)}
              className={cn(
                "relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200",
                "hover:shadow-lg hover:scale-[1.02]",
                isSelected
                  ? "border-[#483cff] bg-[#483cff]/5 shadow-lg"
                  : "border-gray-200 bg-white hover:border-[#483cff]/30"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#483cff] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Più popolare
                  </span>
                </div>
              )}

              {/* Radio Button */}
              <div className="absolute top-6 right-6">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  isSelected 
                    ? "border-[#483cff] bg-[#483cff]" 
                    : "border-gray-300"
                )}>
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4">
                {/* Plan Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getPlanIcon(plan.id)}
                </div>

                <div className="flex-1">
                  {/* Plan Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-dark-green">
                      Punti Furbi {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-[#483cff]">
                        {formatPrice(displayPrice)}
                      </span>
                      <span className="text-gray-600 ml-1">
                        /{getDisplayPeriod()}
                      </span>
                    </div>
                    {interval === 'year' && (
                      <div className="text-sm text-gray-600">
                        {formatPrice(plan.price)}/mese fatturati annualmente
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                    {plan.features.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{plan.features.length - 3} altre funzionalità
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}