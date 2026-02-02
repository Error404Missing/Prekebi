"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Trophy, Users, Calendar, Shield, Zap, Target, Award, Crown, Gift } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

export default function HomePage() {
  const [discordLink, setDiscordLink] = useState("https://discord.gg/your-invite-link")

  useEffect(() => {
    async function fetchDiscordLink() {
      try {
        const supabase = createBrowserClient()
        if (!supabase.from) {
          console.log("[v0] Supabase not configured, using default discord link")
          return
        }
        const { data, error } = await supabase.from("site_settings").select("value").eq("key", "discord_invite_link").single()
        if (!error && data) {
          setDiscordLink(data.value)
        }
      } catch (err) {
        // Silently fail - use default discord link
        console.log("[v0] Failed to fetch discord link, using default")
      }
    }
    fetchDiscordLink()
  }, [])

  return (
    <div className="min-h-screen">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-black to-black" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-balance">
              <span className="text-white">PUBG</span> <span className="text-blue-400">Scrim Arena</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 text-pretty leading-relaxed">
              დარეგისტრირდი და გახდი ნაწილი ქართველების ყველაზე დიდი PUBG კომიუნითის. შემოუერთდი ასობით გუნდს და იბრძოლე
              ტოპ პოზიციისთვის.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-lg px-10 py-7 shadow-lg shadow-blue-500/20 hover-lift"
              >
                <Link href="/auth/register">დაიწყე ახლავე</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white text-lg px-10 py-7 bg-black/50 backdrop-blur-sm hover-lift"
              >
                <Link href="/teams">ნახე გუნდები</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16 animate-fade-in">რატომ ჩვენ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Trophy,
                title: "კონკურენტული თამაში",
                desc: "იბრძოლე საუკეთესო გუნდების წინააღმდეგ",
                color: "text-yellow-400",
                delay: "0s",
              },
              {
                icon: Users,
                title: "გუნდის მენეჯმენტი",
                desc: "მარტივი რეგისტრაცია და მართვა",
                color: "text-blue-400",
                delay: "0.1s",
              },
              {
                icon: Calendar,
                title: "რეგულარული მატჩები",
                desc: "ყოველდღიური scrim განრიგი",
                color: "text-green-400",
                delay: "0.2s",
              },
              {
                icon: Shield,
                title: "უსაფრთხო პლატფორმა",
                desc: "Anti-cheat და სამართლიანი თამაში",
                color: "text-red-400",
                delay: "0.3s",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="glass-effect hover-lift group animate-scale-in"
                style={{ animationDelay: item.delay }}
              >
                <CardHeader>
                  <item.icon
                    className={`w-12 h-12 ${item.color} mb-3 group-hover:scale-110 transition-transform duration-300`}
                  />
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors">{item.title}</CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/10 to-black" />
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">გახდი პროფესიონალი</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                ჩვენი პლატფორმა გთავაზობთ ყველაფერს, რაც საჭიროა რომ გახდეთ საუკეთესო. რეგულარული ტურნირები,
                პროფესიონალური ორგანიზაცია და აქტიური კომიუნითი - ყველაფერი ერთ ადგილას.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "სწრაფი და მარტივი რეგისტრაცია" },
                  { icon: Target, text: "დეტალური სტატისტიკა და ანალიტიკა" },
                  { icon: Award, text: "ღირსეული ჯილდოები და აღიარება" },
                  { icon: Crown, text: "VIP სტატუსი საუკეთესო გუნდებისთვის" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 animate-fade-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center group hover:bg-blue-600/30 transition-colors">
                      <item.icon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-gray-300 text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-gray-800 overflow-hidden hover-lift">
                <div className="w-full h-full flex items-center justify-center">
                  <Trophy className="w-48 h-48 text-blue-500/30 animate-float" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="glass-effect hover-lift overflow-hidden animate-scale-in border border-gray-800/50">
            <CardContent className="p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">შემოუერთდი კომიუნითის</h2>
                <p className="text-gray-400 text-lg text-pretty leading-relaxed mb-8">
                  დაუკავშირდი ასობით მოთამაშეს, მიიღე განახლები რეალურ დროში და იყავი კურსში ყველა ტურნირის, შედეგისა და
                  მნიშვნელოვანი განცხადების შესახებ.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-lg px-10 py-6 flex items-center gap-3 shadow-lg shadow-[#5865F2]/20 hover-lift mx-auto"
                >
                  <Link href={discordLink} target="_blank">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    Discord-ზე გადასვლა
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: "500+", label: "რეგისტრირებული გუნდი", delay: "0s" },
              { value: "2000+", label: "აქტიური მოთამაშე", delay: "0.2s" },
              { value: "100+", label: "ჩატარებული ტურნირი", delay: "0.4s" },
            ].map((stat, idx) => (
              <div key={idx} className="animate-scale-in hover-lift" style={{ animationDelay: stat.delay }}>
                <div className="glass-effect rounded-2xl p-8">
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-lg">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Opening Promo Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-yellow-900/20 via-orange-900/20 to-yellow-900/20 animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/10 to-yellow-500/5 animate-gradient" />
            <div className="absolute top-4 right-4 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
            <CardContent className="relative p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-2 border-yellow-500/30 flex items-center justify-center animate-bounce-subtle">
                    <Gift className="w-16 h-16 text-yellow-400" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    გახსენი{" "}
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      Mystery Case
                    </span>
                  </h2>
                  <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                    ყოველ 2 კვირაში ერთხელ გაქვს შანსი გახსნა Case და მოიგო VIP სტატუსი! 1 დღიანი, 3 დღიანი ან 1 კვირიანი
                    VIP შეიძლება იყოს შენი.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-lg px-10 py-6 shadow-lg shadow-yellow-500/30 hover-lift"
                  >
                    <Link href="/case-opening" className="flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      გახსენი Case
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
