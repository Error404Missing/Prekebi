import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Zap } from "lucide-react"
import { format } from "date-fns"
import { ka } from "date-fns/locale"
import { ScheduleClient } from "@/components/schedule-client"

export default async function SchedulePage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: schedules } = await supabase
    .from("schedules")
    .select("*")
    .eq("is_active", true)
    .order("date", { ascending: true })

  let userTeam = null
  let userVipStatus = null

  if (user) {
    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("leader_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    userTeam = team

    const { data: vipStatus } = await supabase
      .from("user_vip_status")
      .select("vip_until")
      .eq("user_id", user.id)
      .single()

    if (vipStatus && new Date(vipStatus.vip_until) > new Date()) {
      userVipStatus = vipStatus
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <Calendar className="inline-block w-10 h-10 mr-3 text-blue-400" />
            მატჩების განრიგი
          </h1>
          <p className="text-xl text-gray-400 text-pretty">დაგეგმილი scrim მატჩები და ტურნირები</p>
        </div>

        <div className="grid gap-6">
          {schedules && schedules.length > 0 ? (
            schedules.map((schedule) => (
              <Card
                key={schedule.id}
                className="bg-black/50 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/50 transition-all"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl text-blue-400">{schedule.title}</CardTitle>
                        {userVipStatus && (
                          <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded text-yellow-400 text-sm border border-yellow-500/30">
                            <Zap className="w-3 h-3" />
                            VIP
                          </div>
                        )}
                      </div>
                      <CardDescription className="text-gray-400 mt-2">{schedule.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        {format(new Date(schedule.date), "PPP", { locale: ka })}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        {format(new Date(schedule.date), "p", { locale: ka })}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex flex-wrap gap-4 flex-1">
                      {schedule.map_name && (
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                          <span>{schedule.map_name}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-300">
                        <Users className="w-4 h-4 mr-2 text-blue-400" />
                        <span>მაქსიმუმ {schedule.max_teams} გუნდი</span>
                      </div>
                    </div>
                    <ScheduleClient
                      scheduleId={schedule.id}
                      userTeam={userTeam}
                      user={user}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400 text-lg">ამჟამად დაგეგმილი მატჩები არ არის</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
