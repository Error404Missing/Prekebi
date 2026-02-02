import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ban, AlertTriangle } from "lucide-react"

export default async function BlockedPage() {
  const supabase = await createClient()
  const { data: blockedTeams } = await supabase
    .from("teams")
    .select("*, profiles!teams_leader_id_fkey(username)")
    .eq("status", "blocked")
    .order("updated_at", { ascending: false })

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <Ban className="inline-block w-10 h-10 mr-3 text-red-400" />
            დაბლოკილი გუნდები
          </h1>
          <p className="text-xl text-gray-400 text-pretty">წესების დარღვევის გამო დაბლოკილი გუნდების სია</p>
        </div>

        <Card className="bg-gradient-to-r from-red-950/50 to-orange-950/50 border-red-500/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              გაფრთხილება
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-200 text-pretty leading-relaxed">
              ეს გუნდები დაიბლოკა წესების დარღვევის გამო. დაბლოკილ გუნდებს არ შეუძლიათ სკრიმებში მონაწილეობა.
            </p>
            <p className="text-gray-300 text-pretty leading-relaxed">
              თუ თვლით, რომ შეცდომით მოხვდით ამ სიაში, გთხოვთ დაგვიკავშირდეთ კონტაქტის გვერდზე მითითებული საკონტაქტო
              მონაცემების გამოყენებით.
            </p>
          </CardContent>
        </Card>
        {/* </CHANGE> */}

        <div className="grid md:grid-cols-2 gap-6">
          {blockedTeams && blockedTeams.length > 0 ? (
            blockedTeams.map((team) => (
              <Card key={team.id} className="bg-black/50 border-red-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-red-400 flex items-center gap-2">
                    <Ban className="w-5 h-5" />
                    {team.team_name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">[{team.team_tag}]</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">ლიდერი: {team.profiles?.username}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm col-span-full">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400 text-lg">დაბლოკილი გუნდები არ არის</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
