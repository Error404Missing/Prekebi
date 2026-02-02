import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, KeyRound, Lock, Map } from "lucide-react"

export default async function RoomInfoPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: teamData } = await supabase
    .from("teams")
    .select("id, status")
    .eq("leader_id", user.id)
    .eq("status", "approved")
    .single()

  if (!teamData) {
    redirect("/")
  }

  // Fetch room info from settings
  const { data: settingsData } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["room_id", "room_password", "start_time", "map"])

  const roomInfo = {
    room_id: settingsData?.find((s) => s.key === "room_id")?.value || "",
    room_password: settingsData?.find((s) => s.key === "room_password")?.value || "",
    start_time: settingsData?.find((s) => s.key === "start_time")?.value || "",
    map: settingsData?.find((s) => s.key === "map")?.value || "",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-slide-down">Room ინფორმაცია</h1>
            <p className="text-gray-400 text-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
              თამაშის დეტალები და შესვლის მონაცემები
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Room ID Card */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 animate-scale-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <KeyRound className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">Room ID</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {roomInfo.room_id ? (
                  <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                    <p className="text-2xl font-mono text-blue-400 text-center tracking-wider">{roomInfo.room_id}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">ჯერ არ არის დაყენებული</p>
                )}
              </CardContent>
            </Card>

            {/* Password Card */}
            <Card
              className="bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Lock className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">პაროლი</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {roomInfo.room_password ? (
                  <div className="bg-black/40 p-4 rounded-lg border border-purple-500/20">
                    <p className="text-2xl font-mono text-purple-400 text-center tracking-wider">
                      {roomInfo.room_password}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">ჯერ არ არის დაყენებული</p>
                )}
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card
              className="bg-gradient-to-br from-gray-900 to-gray-950 border-green-500/30 hover:border-green-500/50 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Map className="w-6 h-6 text-green-400" />
                  </div>
                  <CardTitle className="text-white">რუკა</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {roomInfo.map ? (
                  <div className="bg-black/40 p-4 rounded-lg border border-green-500/20">
                    <p className="text-2xl font-semibold text-green-400 text-center">{roomInfo.map}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">ჯერ არ არის დაყენებული</p>
                )}
              </CardContent>
            </Card>

            {/* Start Time Card */}
            <Card
              className="bg-gradient-to-br from-gray-900 to-gray-950 border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-400" />
                  </div>
                  <CardTitle className="text-white">დაწყების დრო</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {roomInfo.start_time ? (
                  <div className="bg-black/40 p-4 rounded-lg border border-orange-500/20">
                    <p className="text-xl font-semibold text-orange-400 text-center">
                      {new Date(roomInfo.start_time).toLocaleString("ka-GE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">ჯერ არ არის დაყენებული</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Card
            className="mt-8 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <span className="text-2xl">⚠️</span> მნიშვნელოვანი
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>• Room ID და პაროლი გამოიყენეთ თამაშში შესასვლელად</p>
              <p>• დაიწყეთ შესვლა მითითებულ დროზე 5 წუთით ადრე</p>
              <p>• არ გაუზიაროთ ეს ინფორმაცია სხვა გუნდებს</p>
              <p>• კითხვების შემთხვევაში დაუკავშირდით ადმინისტრაციას</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
