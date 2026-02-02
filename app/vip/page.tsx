import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Users, Sparkles, Zap, Star, Trophy, Shield, Rocket, Gift, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function VIPPage() {
  const supabase = await createClient()
  const { data: vipTeams } = await supabase
    .from("teams")
    .select("*, profiles!teams_leader_id_fkey(username)")
    .eq("is_vip", true)
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="container mx-auto max-w-7xl relative">
        {/* Hero Section */}
        <div className="mb-16 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-purple-500/30 border-2 border-purple-500/50 mb-8 animate-bounce-subtle shadow-2xl shadow-purple-500/30">
            <Crown className="w-12 h-12 text-purple-300" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
              VIP ELITE
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            გახდი ელიტური გუნდის ნაწილი და მიიღე ექსკლუზიური უპირატესობები
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto mb-20 animate-scale-in">
          <Card className="relative overflow-hidden border-2 border-purple-500/50 bg-gradient-to-b from-purple-950/60 via-black/80 to-purple-950/60 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
            {/* Popular Badge */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white text-xs font-bold px-6 py-2 rounded-b-xl shadow-lg">
                PREMIUM
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />
            
            <CardHeader className="text-center pt-12 pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                <CardTitle className="text-3xl font-bold text-white">VIP გუნდის სტატუსი</CardTitle>
                <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
              </div>
              <div className="mt-4">
                <span className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  VIP
                </span>
              </div>
              <CardDescription className="text-gray-400 mt-4 text-base">
                ერთჯერადი შეძენა - სამუდამო უპირატესობები
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-8">
              <div className="space-y-4 mb-8">
                {[
                  { icon: Rocket, text: "პრიორიტეტული რეგისტრაცია ყველა სკრიმზე" },
                  { icon: Star, text: "ექსკლუზიური VIP Badge და დიზაინი" },
                  { icon: Shield, text: "დაცული სლოტი ყველა მატჩში" },
                  { icon: Trophy, text: "პრესტიჟული სტატუსი საზოგადოებაში" },
                  { icon: Gift, text: "სპეციალური ბონუსები და აქციები" },
                  { icon: Crown, text: "ელიტური გუნდების სიაში ჩვენება" },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                      <feature.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">{feature.text}</span>
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                  </div>
                ))}
              </div>
              
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white font-bold text-lg py-7 rounded-xl shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <Link href="/contact" className="flex items-center justify-center gap-3">
                  <Crown className="w-6 h-6" />
                  დაგვიკავშირდით შესაძენად
                </Link>
              </Button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                დაგვიკავშირდით Discord-ზე ან Facebook-ზე
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            რატომ უნდა აირჩიო <span className="text-purple-400">VIP</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "სწრაფი დადასტურება", desc: "თქვენი განაცხადი პრიორიტეტულად განიხილება", color: "yellow" },
              { icon: Star, title: "გამორჩეული დიზაინი", desc: "VIP badge და სპეციალური ვიზუალი", color: "purple" },
              { icon: Trophy, title: "ელიტური სტატუსი", desc: "აღიარება როგორც ტოპ გუნდი", color: "pink" },
              { icon: Shield, title: "გარანტირებული სლოტი", desc: "ყოველთვის გაქვთ ადგილი სკრიმში", color: "blue" },
            ].map((benefit, idx) => (
              <Card 
                key={idx} 
                className="group relative overflow-hidden bg-black/60 border-gray-800 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
                <CardContent className="p-6 relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* VIP Teams Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              <Crown className="inline-block w-8 h-8 mr-3 text-purple-400" />
              VIP გუნდები
            </h2>
            <p className="text-gray-400">ჩვენი ელიტური გუნდები</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vipTeams && vipTeams.length > 0 ? (
              vipTeams.map((team, index) => (
                <Card
                  key={team.id}
                  className="group relative overflow-hidden bg-gradient-to-br from-purple-950/40 via-black/60 to-pink-950/40 border-purple-500/50 backdrop-blur-sm hover:border-purple-400/80 transition-all duration-500 shadow-xl shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 animate-scale-in hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Animated glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-white flex items-center gap-2 group-hover:text-purple-300 transition-colors">
                          <Crown className="w-5 h-5 text-purple-400 animate-pulse" />
                          {team.team_name}
                        </CardTitle>
                        <CardDescription className="text-gray-400 mt-1 font-mono">[{team.team_tag}]</CardDescription>
                      </div>
                      {team.slot_number && (
                        <Badge variant="outline" className="border-purple-500/50 text-purple-300 font-bold">
                          Slot #{team.slot_number}
                        </Badge>
                      )}
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 w-fit mt-2 shadow-lg shadow-purple-500/30">
                      VIP ELITE
                    </Badge>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-center text-sm text-gray-300 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Users className="w-4 h-4 mr-2 text-purple-400" />
                      <span className="font-medium">ლიდერი:</span>
                      <span className="ml-2 text-white">{team.profiles?.username || 'უცნობი'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-black/60 border-gray-800 backdrop-blur-sm col-span-full animate-fade-in">
                <CardContent className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
                    <Crown className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-gray-400 text-lg mb-2">VIP გუნდები ჯერ არ არის</p>
                  <p className="text-gray-500 text-sm">იყავი პირველი VIP გუნდი!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
