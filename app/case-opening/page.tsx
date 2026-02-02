"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { Gift, Crown, Star, Sparkles, Clock, X } from "lucide-react"
import Link from "next/link"

type Reward = {
  id: string
  name: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  icon: typeof Crown
  days: number
  probability: number
}

const rewards: Reward[] = [
  {
    id: "nothing",
    name: "ცარიელი",
    description: "იღბალი შემდეგ ჯერზე!",
    color: "text-gray-400",
    bgColor: "bg-gray-800/50",
    borderColor: "border-gray-600",
    icon: X,
    days: 0,
    probability: 10,
  },
  {
    id: "vip_1_day",
    name: "1 დღიანი VIP",
    description: "VIP სტატუსი 24 საათით",
    color: "text-green-400",
    bgColor: "bg-green-900/30",
    borderColor: "border-green-500",
    icon: Star,
    days: 1,
    probability: 40,
  },
  {
    id: "vip_3_days",
    name: "3 დღიანი VIP",
    description: "VIP სტატუსი 3 დღით",
    color: "text-blue-400",
    bgColor: "bg-blue-900/30",
    borderColor: "border-blue-500",
    icon: Sparkles,
    days: 3,
    probability: 35,
  },
  {
    id: "vip_1_week",
    name: "1 კვირიანი VIP",
    description: "VIP სტატუსი 7 დღით",
    color: "text-yellow-400",
    bgColor: "bg-yellow-900/30",
    borderColor: "border-yellow-500",
    icon: Crown,
    days: 7,
    probability: 15,
  },
]

export default function CaseOpeningPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [canOpen, setCanOpen] = useState(false)
  const [nextOpenTime, setNextOpenTime] = useState<Date | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinningIndex, setSpinningIndex] = useState(0)
  const [wonReward, setWonReward] = useState<Reward | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [vipStatus, setVipStatus] = useState<{ vip_until: string } | null>(null)
  const [countdown, setCountdown] = useState("")

  const checkCanOpen = useCallback(async (userId: string) => {
    try {
      const supabase = createBrowserClient()
      if (!supabase.from) {
        console.log("[v0] Supabase not configured")
        setCanOpen(true)
        setNextOpenTime(null)
        return
      }
      const { data: lastOpen, error } = await supabase
        .from("case_openings")
        .select("opened_at")
        .eq("user_id", userId)
        .order("opened_at", { ascending: false })
        .limit(1)
        .single()

      // If no error but no data, user hasn't opened a case yet
      if (error && error.code === 'PGRST116') {
        setCanOpen(true)
        setNextOpenTime(null)
        return
      }

      if (!lastOpen) {
        setCanOpen(true)
        setNextOpenTime(null)
        return
      }

      const lastOpenDate = new Date(lastOpen.opened_at)
      const twoWeeksLater = new Date(lastOpenDate.getTime() + 14 * 24 * 60 * 60 * 1000)
      const now = new Date()

      if (now >= twoWeeksLater) {
        setCanOpen(true)
        setNextOpenTime(null)
      } else {
        setCanOpen(false)
        setNextOpenTime(twoWeeksLater)
      }
    } catch (err) {
      console.error("[v0] Error checking case opening:", err)
      setCanOpen(true)
      setNextOpenTime(null)
    }
  }, [])

  const fetchVipStatus = useCallback(async (userId: string) => {
    try {
      const supabase = createBrowserClient()
      if (!supabase.from) {
        console.log("[v0] Supabase not configured")
        setVipStatus(null)
        return
      }
      const { data } = await supabase.from("user_vip_status").select("vip_until").eq("user_id", userId).single()

      if (data && new Date(data.vip_until) > new Date()) {
        setVipStatus(data)
      } else {
        setVipStatus(null)
      }
    } catch (error) {
      console.error("[v0] Error fetching VIP status:", error)
      setVipStatus(null)
    }
  }, [])

  useEffect(() => {
    async function checkUser() {
      try {
        const supabase = createBrowserClient()
        if (!supabase.auth || typeof supabase.auth.getUser !== 'function') {
          console.log("[v0] Supabase not configured")
          setLoading(false)
          return
        }
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          console.log("[v0] Checking case opening status for user:", user.id)
          await checkCanOpen(user.id)
          await fetchVipStatus(user.id)
        }

        setLoading(false)
      } catch (error) {
        console.error("[v0] Error checking user:", error)
        setLoading(false)
      }
    }

    // Check immediately on mount
    checkUser()

    // Also set up a listener for auth changes
    try {
      const supabase = createBrowserClient()
      if (!supabase.auth || typeof supabase.auth.onAuthStateChange !== 'function') {
        return
      }
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          console.log("[v0] Auth state changed, rechecking case status")
          await checkCanOpen(session.user.id)
          await fetchVipStatus(session.user.id)
        }
      })

      return () => {
        subscription?.unsubscribe()
      }
    } catch (error) {
      console.error("[v0] Error setting up auth listener:", error)
      return undefined
    }
  }, [checkCanOpen, fetchVipStatus])

  useEffect(() => {
    if (!nextOpenTime) return

    const interval = setInterval(() => {
      const now = new Date()
      const diff = nextOpenTime.getTime() - now.getTime()

      if (diff <= 0) {
        setCanOpen(true)
        setNextOpenTime(null)
        setCountdown("")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown(`${days}დ ${hours}სთ ${minutes}წთ ${seconds}წმ`)
    }, 1000)

    return () => clearInterval(interval)
  }, [nextOpenTime])

  const getRandomReward = (): Reward => {
    const random = Math.random() * 100
    let cumulative = 0

    for (const reward of rewards) {
      cumulative += reward.probability
      if (random <= cumulative) {
        return reward
      }
    }

    return rewards[0]
  }

  const handleOpenCase = async () => {
    if (!user || isSpinning) return

    // Always check if user can actually open a case (verify against database)
    console.log("[v0] Verifying case opening eligibility before opening")
    try {
      const supabase = createBrowserClient()
      if (!supabase.from) {
        console.log("[v0] Supabase not configured")
        return
      }
      const { data: lastOpen, error } = await supabase
        .from("case_openings")
        .select("opened_at")
        .eq("user_id", user.id)
        .order("opened_at", { ascending: false })
        .limit(1)
        .single()

      let canOpenNow = false

      if (error && error.code === 'PGRST116') {
        // No previous openings
        canOpenNow = true
        console.log("[v0] No previous openings found, user can open")
      } else if (lastOpen) {
        const lastOpenDate = new Date(lastOpen.opened_at)
        const twoWeeksLater = new Date(lastOpenDate.getTime() + 14 * 24 * 60 * 60 * 1000)
        const now = new Date()

        canOpenNow = now >= twoWeeksLater
        console.log("[v0] Last open:", lastOpenDate.toISOString(), "Can open now:", canOpenNow)
      }

      if (!canOpenNow) {
        console.log("[v0] User cannot open case yet (cooldown active)")
        // Recalculate and update state
        if (lastOpen) {
          const lastOpenDate = new Date(lastOpen.opened_at)
          const twoWeeksLater = new Date(lastOpenDate.getTime() + 14 * 24 * 60 * 60 * 1000)
          setCanOpen(false)
          setNextOpenTime(twoWeeksLater)
        }
        return
      }
    } catch (err) {
      console.error("[v0] Error verifying case opening:", err)
      return
    }

    setIsSpinning(true)
    setShowResult(false)
    setWonReward(null)

    const finalReward = getRandomReward()

    // Spinning animation
    let spinCount = 0
    const maxSpins = 30
    const spinInterval = setInterval(() => {
      setSpinningIndex((prev) => (prev + 1) % rewards.length)
      spinCount++

      if (spinCount >= maxSpins) {
        clearInterval(spinInterval)

        // Slow down effect
        let slowCount = 0
        const slowInterval = setInterval(() => {
          setSpinningIndex((prev) => (prev + 1) % rewards.length)
          slowCount++

          if (slowCount >= 10) {
            clearInterval(slowInterval)
            setSpinningIndex(rewards.findIndex((r) => r.id === finalReward.id))
            setWonReward(finalReward)
            setShowResult(true)
            setIsSpinning(false)

            // Save to database
            saveReward(finalReward)
          }
        }, 100 + slowCount * 50)
      }
    }, 50)
  }

  const saveReward = async (reward: Reward) => {
    if (!user) return

    try {
      const supabase = createBrowserClient()
      if (!supabase.from) {
        console.log("[v0] Supabase not configured")
        return
      }

      // Insert case opening record
      await supabase.from("case_openings").insert({
        user_id: user.id,
        reward: reward.id,
      })

      // If won VIP, update or insert VIP status
      if (reward.days > 0) {
        const { data: existingVip } = await supabase
          .from("user_vip_status")
          .select("vip_until")
          .eq("user_id", user.id)
          .single()

        let newVipUntil: Date

        if (existingVip && new Date(existingVip.vip_until) > new Date()) {
          // Extend existing VIP
          newVipUntil = new Date(new Date(existingVip.vip_until).getTime() + reward.days * 24 * 60 * 60 * 1000)
        } else {
          // New VIP
          newVipUntil = new Date(Date.now() + reward.days * 24 * 60 * 60 * 1000)
        }

        await supabase.from("user_vip_status").upsert({
          user_id: user.id,
          vip_until: newVipUntil.toISOString(),
          updated_at: new Date().toISOString(),
        })

        setVipStatus({ vip_until: newVipUntil.toISOString() })
      }

      // Update can open status
      setCanOpen(false)
      setNextOpenTime(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))
    } catch (error) {
      console.error("[v0] Error saving reward:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="glass-effect max-w-md w-full animate-scale-in">
          <CardContent className="p-8 text-center">
            <Gift className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Case Opening</h2>
            <p className="text-gray-400 mb-6">გთხოვთ გაიაროთ ავტორიზაცია Case-ის გასახსნელად</p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600">
              <Link href="/auth/login">შესვლა</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-white">Case</span>{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Opening</span>
          </h1>
          <p className="text-gray-400 text-lg">გახსენი Case და მოიგე VIP სტატუსი!</p>
        </div>

        {vipStatus && (
          <div className="mb-8 animate-scale-in">
            <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/50">
              <CardContent className="p-6 flex items-center justify-center gap-4">
                <Crown className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-yellow-400 font-bold">VIP სტატუსი აქტიურია</p>
                  <p className="text-gray-300 text-sm">
                    მოქმედებს: {new Date(vipStatus.vip_until).toLocaleDateString("ka-GE")}-მდე
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="relative mb-12">
          {/* Case Display */}
          <div className="relative mx-auto max-w-lg">
            <Card
              className={`relative overflow-hidden transition-all duration-500 ${
                isSpinning ? "animate-pulse" : ""
              } ${showResult && wonReward ? wonReward.bgColor + " " + wonReward.borderColor : "glass-effect border-gray-700"}`}
            >
              <CardContent className="p-12">
                {/* Spinning Display */}
                <div className="relative h-48 flex items-center justify-center overflow-hidden">
                  {isSpinning && !showResult ? (
                    <div className="text-center animate-bounce">
                      <div
                        className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${rewards[spinningIndex].bgColor}`}
                      >
                        {(() => {
                          const Icon = rewards[spinningIndex].icon
                          return <Icon className={`w-12 h-12 ${rewards[spinningIndex].color}`} />
                        })()}
                      </div>
                      <p className={`text-2xl font-bold ${rewards[spinningIndex].color}`}>
                        {rewards[spinningIndex].name}
                      </p>
                    </div>
                  ) : showResult && wonReward ? (
                    <div className="text-center animate-scale-in">
                      <div
                        className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${wonReward.bgColor} border-4 ${wonReward.borderColor} animate-glow`}
                      >
                        {(() => {
                          const Icon = wonReward.icon
                          return <Icon className={`w-16 h-16 ${wonReward.color}`} />
                        })()}
                      </div>
                      <p className={`text-3xl font-bold mb-2 ${wonReward.color}`}>{wonReward.name}</p>
                      <p className="text-gray-400">{wonReward.description}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center border-4 border-blue-500/30 animate-float">
                        <Gift className="w-16 h-16 text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">Mystery Case</p>
                      <p className="text-gray-400">დააჭირე გასახსნელად</p>
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                  {showResult && wonReward && wonReward.days > 0 && (
                    <>
                      <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                      <div
                        className="absolute top-8 right-8 w-3 h-3 bg-blue-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="absolute bottom-12 left-12 w-2 h-2 bg-purple-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.4s" }}
                      />
                      <div
                        className="absolute bottom-8 right-4 w-3 h-3 bg-green-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.6s" }}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Open Button */}
          <div className="text-center mt-8">
            {canOpen ? (
              <Button
                onClick={handleOpenCase}
                disabled={isSpinning}
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-xl px-16 py-8 shadow-lg shadow-yellow-500/30 hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSpinning ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
                    იხსნება...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Gift className="w-6 h-6" />
                    გახსენი Case
                  </span>
                )}
              </Button>
            ) : (
              <div className="glass-effect rounded-xl p-6 inline-block">
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-6 h-6" />
                  <div>
                    <p className="text-sm">შემდეგი Case ხელმისაწვდომია:</p>
                    <p className="text-2xl font-bold text-blue-400">{countdown}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rewards Info */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">შესაძლო ჯილდოები</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rewards.map((reward, idx) => (
              <Card
                key={reward.id}
                className={`${reward.bgColor} border ${reward.borderColor} hover-lift animate-scale-in`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full ${reward.bgColor} border-2 ${reward.borderColor} flex items-center justify-center`}
                  >
                    {(() => {
                      const Icon = reward.icon
                      return <Icon className={`w-8 h-8 ${reward.color}`} />
                    })()}
                  </div>
                  <p className={`font-bold ${reward.color}`}>{reward.name}</p>
                  <p className="text-gray-400 text-sm mt-1">{reward.probability}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rules */}
        <Card className="glass-effect mt-12 animate-fade-in">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-white mb-4">წესები</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Case-ის გახსნა შესაძლებელია 2 კვირაში ერთხელ
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                მოგებული VIP სტატუსი ავტომატურად აქტიურდება
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                თუ უკვე გაქვთ VIP, ახალი მოგება დაემატება არსებულ დროს
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                VIP სტატუსი გაძლევთ პრიორიტეტულ მონაწილეობას სკრიმებში
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
