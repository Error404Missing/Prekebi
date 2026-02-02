import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, AlertCircle, ShieldAlert } from "lucide-react"

export default async function RulesPage() {
  const supabase = await createClient()
  const { data: rules } = await supabase.from("rules").select("*").order("order_number", { ascending: true })

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <BookOpen className="inline-block w-10 h-10 mr-3 text-blue-400" />
            წესები და რეგულაციები
          </h1>
          <p className="text-xl text-gray-400 text-pretty">გთხოვთ გაეცნოთ და დაიცვათ ყველა წესი</p>
        </div>

        <Card className="bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border-blue-500/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-400 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              მნიშვნელოვანი ინფორმაცია
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-200 text-pretty leading-relaxed">
              ყველა მონაწილე ვალდებულია გაეცნოს და დაიცვას ქვემოთ მოცემული წესები. წესების დარღვევა გამოიწვევს შესაბამის
              სანქციებს, მათ შორის გუნდის დისკვალიფიკაციას ან სრულ დაბლოკვას.
            </p>
            <p className="text-gray-300 text-pretty leading-relaxed">
              წესები შეიძლება განახლდეს დროდადრო. გირჩევთ რეგულარულად შეამოწმოთ ეს გვერდი განახლებების შესახებ.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-950/30 to-orange-950/30 border-red-500/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              სანქციები წესების დარღვევისთვის
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="min-w-2 min-h-2 rounded-full bg-red-400 mt-2"></div>
                <p className="text-gray-300 text-sm text-pretty">
                  <span className="font-semibold text-red-400">პირველი დარღვევა:</span> გაფრთხილება და ქულების აღება
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-2 min-h-2 rounded-full bg-red-400 mt-2"></div>
                <p className="text-gray-300 text-sm text-pretty">
                  <span className="font-semibold text-red-400">მეორე დარღვევა:</span> დროებითი შეჩერება (1-2 სკრიმი)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-2 min-h-2 rounded-full bg-red-400 mt-2"></div>
                <p className="text-gray-300 text-sm text-pretty">
                  <span className="font-semibold text-red-400">მესამე დარღვევა:</span> სრული დაბლოკვა და სიიდან ამოშლა
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* </CHANGE> */}

        <div className="space-y-6">
          {rules && rules.length > 0 ? (
            rules.map((rule, index) => (
              <Card
                key={rule.id}
                className="bg-black/50 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/50 transition-all"
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-400">
                    {index + 1}. {rule.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-pretty leading-relaxed">{rule.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400 text-lg">წესები ჯერ არ არის დამატებული</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
