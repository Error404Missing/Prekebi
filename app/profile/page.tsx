import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, MessageSquare, Shield, Edit, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: userTeam } = await supabase
    .from("teams")
    .select("*")
    .eq("leader_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  let userVipStatus = null
  if (user) {
    const { data: vipData, error: vipError } = await supabase
      .from("user_vip_status")
      .select("vip_until")
      .eq("user_id", user.id)
      .single()

    if (vipError) {
      console.log("[v0] VIP status fetch error:", vipError.code, vipError.message)
    }

    if (vipData && new Date(vipData.vip_until) > new Date()) {
      userVipStatus = vipData
      console.log("[v0] User has active VIP status until:", vipData.vip_until)
    }
  }

  async function requestScrim() {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("teams").update({ status: "pending" }).eq("leader_id", user.id).eq("status", "draft")

    redirect("/profile")
  }
  // </CHANGE>

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">პროფილი</h1>
          <p className="text-gray-400">მართე შენი ანგარიში და გუნდი</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm md:col-span-1">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <User className="w-5 h-5" />
                პროფილის ინფორმაცია
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">მომხმარებელი</p>
                <p className="text-white font-medium">{profile?.username || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  ელ.ფოსტა
                </p>
                <p className="text-white text-sm break-all">{profile?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  Discord
                </p>
                <p className="text-white font-medium">{profile?.discord_username || "არ არის მითითებული"}</p>
              </div>
              {profile?.is_admin && (
                <div>
                  <Badge className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-1 w-fit">
                    <Shield className="w-3 h-3" />
                    ადმინისტრატორი
                  </Badge>
                </div>
              )}
              {userVipStatus && (
                <div>
                  <Badge className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-1 w-fit">
                    <Shield className="w-3 h-3" />
                    VIP სტატუსი
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="text-blue-400">გუნდის ინფორმაცია</CardTitle>
              <CardDescription className="text-gray-400">თქვენი გუნდის სტატუსი და დეტალები</CardDescription>
            </CardHeader>
            <CardContent>
              {userTeam ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-400">{userTeam.team_name}</h3>
                      <p className="text-gray-400">[{userTeam.team_tag}]</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userTeam.status === "draft" && (
                        <Badge variant="outline" className="border-gray-500/50 text-gray-400">
                          მონახაზი
                        </Badge>
                      )}
                      {/* </CHANGE> */}
                      {userTeam.status === "pending" && (
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                          განხილვაში
                        </Badge>
                      )}
                      {userTeam.status === "approved" && (
                        <Badge variant="outline" className="border-green-500/50 text-green-400">
                          დადასტურებული
                        </Badge>
                      )}
                      {userTeam.status === "rejected" && (
                        <Badge variant="outline" className="border-red-500/50 text-red-400">
                          უარყოფილი
                        </Badge>
                      )}
                      {userTeam.status === "blocked" && (
                        <Badge variant="outline" className="border-red-500/50 text-red-400">
                          დაბლოკილი
                        </Badge>
                      )}
                      {userTeam.is_vip && <Badge className="bg-yellow-600 hover:bg-yellow-700">VIP</Badge>}
                      {userTeam.slot_number && (
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                          Slot #{userTeam.slot_number}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-blue-500/20">
                    <div className="bg-gray-900/30 p-4 rounded-lg border border-blue-500/20">
                      <p className="text-sm text-gray-400 mb-1">მოთამაშეების რაოდენობა</p>
                      <p className="text-2xl font-bold text-blue-400">{userTeam.players_count || 0}</p>
                    </div>
                    <div className="bg-gray-900/30 p-4 rounded-lg border border-blue-500/20">
                      <p className="text-sm text-gray-400 mb-1">მაპების რაოდენობა</p>
                      <p className="text-2xl font-bold text-blue-400">{userTeam.maps_count || 0}</p>
                    </div>
                  </div>
                  {/* </CHANGE> */}

                  <div className="pt-4 border-t border-blue-500/20 flex flex-wrap gap-3">
                    {userTeam.status === "draft" && (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="border-blue-500/50 hover:bg-blue-500/10 bg-transparent"
                        >
                          <Link href="/profile/edit-team">
                            <Edit className="w-4 h-4 mr-2" />
                            გუნდის რედაქტირება
                          </Link>
                        </Button>
                        <form action={requestScrim}>
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            <Send className="w-4 h-4 mr-2" />
                            მოითხოვე სკრიმზე თამაში
                          </Button>
                        </form>
                      </>
                    )}
                    {userTeam.status === "pending" && (
                      <p className="text-sm text-yellow-400">
                        თქვენი გუნდი ელოდება ადმინისტრაციის დადასტურებას. გთხოვთ მოითმინოთ.
                      </p>
                    )}
                    {userTeam.status === "rejected" && (
                      <>
                        <p className="text-sm text-red-400 w-full mb-2">
                          თქვენი გუნდი უარყოფილია. გთხოვთ შეამოწმოთ მონაცემები და სცადოთ ხელახლა.
                        </p>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                          <Link href="/profile/register-team">ხელახლა რეგისტრაცია</Link>
                        </Button>
                      </>
                    )}
                    {userTeam.status === "blocked" && (
                      <p className="text-sm text-red-400">
                        თქვენი გუნდი დაბლოკილია. დამატებითი ინფორმაციისთვის დაუკავშირდით ადმინისტრაციას.
                      </p>
                    )}
                  </div>
                  {/* </CHANGE> */}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-6">თქვენ ჯერ არ გაქვთ რეგისტრირებული გუნდი</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/profile/register-team">გუნდის რეგისტრაცია</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
