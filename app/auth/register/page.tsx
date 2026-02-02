"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [discordUsername, setDiscordUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })
      if (error) throw error
      router.push("/auth/success")
    } catch (error: unknown) {
      console.error("[v0] Registration error:", error)
      if (error instanceof Error) {
        if (error.message.includes("NetworkError") || error.message.includes("fetch")) {
          setError("ქსელის შეცდომა. გთხოვთ შეამოწმოთ ინტერნეტ კავშირი და სცადოთ თავიდან.")
        } else {
          setError(error.message)
        }
      } else {
        setError("შეცდომა მოხდა")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-blue-950">
      <div className="w-full max-w-md">
        <Card className="border-blue-500/20 bg-black/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-400">რეგისტრაცია</CardTitle>
            <CardDescription className="text-gray-400">შექმენით ახალი ანგარიში</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-gray-200">
                    მომხმარებლის სახელი
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-900/50 border-blue-500/30 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-200">
                    ელ.ფოსტა
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-900/50 border-blue-500/30 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-200">
                    პაროლი
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-900/50 border-blue-500/30 text-white"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "რეგისტრაცია..." : "რეგისტრაცია"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-gray-400">
                უკვე გაქვთ ანგარიში?{" "}
                <Link href="/auth/login" className="text-blue-400 underline underline-offset-4 hover:text-blue-300">
                  შესვლა
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
