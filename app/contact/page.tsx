"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Clock, HelpCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"

export default function ContactPage() {
  const [settings, setSettings] = useState({
    discordLink: "https://discord.gg/your-invite-link",
    email: "contact@pubgscrims.ge",
    discordUsername: "admin#1234",
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const supabase = createBrowserClient()
        if (!supabase.from) {
          console.log("[v0] Supabase not configured")
          return
        }
        const { data } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["discord_invite_link", "contact_email", "contact_discord"])

        if (data) {
          const settingsMap = data.reduce(
            (acc, item) => {
              if (item.key === "discord_invite_link") acc.discordLink = item.value
              if (item.key === "contact_email") acc.email = item.value
              if (item.key === "contact_discord") acc.discordUsername = item.value
              return acc
            },
            { discordLink: "", email: "", discordUsername: "" },
          )
          setSettings(settingsMap)
        }
      } catch (error) {
        console.error("[v0] Error fetching settings:", error)
      }
    }
    fetchSettings()
  }, [])
  // </CHANGE>

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <MessageSquare className="inline-block w-10 h-10 mr-3 text-blue-400" />
            კონტაქტი
          </h1>
          <p className="text-xl text-gray-400 text-pretty">დაგვიკავშირდით ნებისმიერი შეკითხვით</p>
        </div>

        <Card className="bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border-blue-500/20 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <p className="text-gray-200 text-pretty leading-relaxed mb-4">
              გვაქვს მზადყოფნა დაგეხმაროთ ნებისმიერ საკითხში დაკავშირებულ PUBG სკრიმებთან. შეგიძლიათ დაგვიკავშირდეთ
              ელექტრონული ფოსტის ან Discord-ის საშუალებით.
            </p>
            <p className="text-gray-300 text-pretty leading-relaxed">
              ჩვენი გუნდი პასუხობს თქვენს შეკითხვებს სამუშაო საათებში. გთხოვთ აღწეროთ თქვენი პრობლემა დეტალურად, რომ
              შევძლოთ მაქსიმალურად სწრაფად დახმარება.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/50 transition-all">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-600/20 rounded-full">
                  <Mail className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-blue-400">ელ.ფოსტა</CardTitle>
              <CardDescription className="text-gray-300 mt-2">{settings.email}</CardDescription>
              {/* </CHANGE> */}
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-sm text-gray-400">ოფიციალური კორესპონდენციისთვის</p>
              <Button
                asChild
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent"
              >
                <a href={`mailto:${settings.email}`}>გაგზავნა</a>
                {/* </CHANGE> */}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/50 transition-all">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-indigo-600/20 rounded-full">
                  <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl text-indigo-400">Discord</CardTitle>
              <CardDescription className="text-gray-300 mt-2">{settings.discordUsername}</CardDescription>
              {/* </CHANGE> */}
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-sm text-gray-400">სწრაფი პასუხებისთვის</p>
              <Button
                asChild
                variant="outline"
                className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 bg-transparent"
              >
                <Link href={settings.discordLink} target="_blank">
                  Discord-ზე გადასვლა
                </Link>
                {/* </CHANGE> */}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-blue-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                სამუშაო საათები
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>ორშაბათი - პარასკევი:</span>
                <span className="font-semibold">10:00 - 20:00</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>შაბათი - კვირა:</span>
                <span className="font-semibold">12:00 - 18:00</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-blue-400 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                ხშირი შეკითხვები
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm text-pretty leading-relaxed">
                რეგისტრაციის, გუნდების დადასტურების და სხვა საკითხებზე პასუხები იხილეთ დახმარების გვერდზე.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-blue-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                ტექნიკური მხარდაჭერა
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm text-pretty leading-relaxed">
                ტექნიკური პრობლემების შემთხვევაში, დაუყოვნებლივ დაგვიკავშირდით Discord-ის ან ელ.ფოსტის გზით.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
