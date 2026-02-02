import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import Image from "next/image"

export default async function ResultsPage() {
  const supabase = await createClient()
  const { data: results } = await supabase.from("results").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <Trophy className="inline-block w-10 h-10 mr-3 text-blue-400" />
            შედეგები
          </h1>
          <p className="text-xl text-gray-400 text-pretty">ტურნირების შედეგები და გამარჯვებული გუნდები</p>
        </div>

        <div className="grid gap-6">
          {results && results.length > 0 ? (
            results.map((result) => (
              <Card
                key={result.id}
                className="bg-black/50 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/50 transition-all overflow-hidden"
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-400">{result.title}</CardTitle>
                  {result.description && <p className="text-gray-400 mt-2 text-pretty">{result.description}</p>}
                </CardHeader>
                {result.image_url && (
                  <CardContent>
                    <div className="relative w-full h-96 rounded-lg overflow-hidden">
                      <Image
                        src={result.image_url || "/placeholder.svg"}
                        alt={result.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400 text-lg">შედეგები ჯერ არ არის გამოქვეყნებული</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
