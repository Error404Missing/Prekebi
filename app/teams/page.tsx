import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Crown, Shield, Gamepad2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function TeamsPage() {
  const supabase = await createClient()
  const { data: teams } = await supabase
    .from("teams")
    .select("*, profiles!teams_leader_id_fkey(username)")
    .eq("status", "approved")
    .order("is_vip", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto max-w-7xl relative">
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 mb-6 animate-bounce-subtle">
            <Users className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            რეგისტრირებული გუნდები
          </h1>
          <p className="text-xl text-gray-400 text-pretty max-w-2xl mx-auto">ყველა აქტიური და დადასტურებული გუნდი რომლებიც მონაწილეობენ სკრიმებში</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams && teams.length > 0 ? (
            teams.map((team, index) => (
              <Card
                key={team.id}
                className={`group relative overflow-hidden animate-scale-in hover-lift ${
                  team.is_vip
                    ? "bg-gradient-to-br from-yellow-950/40 to-orange-950/40 border-yellow-500/50 shadow-lg shadow-yellow-500/20"
                    : "bg-black/60 border-gray-800 hover:border-blue-500/50"
                } backdrop-blur-sm transition-all duration-300`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  team.is_vip 
                    ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10' 
                    : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                }`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle
                        className={`text-xl font-bold flex items-center gap-2 ${team.is_vip ? "text-yellow-400" : "text-white group-hover:text-blue-400 transition-colors"}`}
                      >
                        {team.is_vip && <Crown className="w-5 h-5 animate-pulse" />}
                        {team.team_name}
                      </CardTitle>
                      <CardDescription className="text-gray-500 mt-1 font-mono">[{team.team_tag}]</CardDescription>
                    </div>
                    {team.slot_number && (
                      <Badge variant="outline" className={`${team.is_vip ? 'border-yellow-500/50 text-yellow-400' : 'border-blue-500/50 text-blue-400'} font-bold`}>
                        Slot #{team.slot_number}
                      </Badge>
                    )}
                  </div>
                  {team.is_vip && (
                    <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 w-fit mt-2 animate-pulse">
                      VIP
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-300 p-2 rounded-lg bg-white/5">
                      <Shield className={`w-4 h-4 mr-2 ${team.is_vip ? 'text-yellow-400' : 'text-blue-400'}`} />
                      <span className="font-medium">ლიდერი:</span>
                      <span className="ml-2 text-white">{team.profiles?.username || 'უცნობი'}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <Gamepad2 className="w-4 h-4" />
                        <span>მოთამაშეების რაოდენობა: {team.players_count || 4}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-black/60 border-gray-800 backdrop-blur-sm col-span-full animate-fade-in">
              <CardContent className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                  <Users className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg">რეგისტრირებული გუნდები ჯერ არ არის</p>
                <p className="text-gray-500 text-sm mt-2">პირველი იყავი და დაარეგისტრირე შენი გუნდი!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
