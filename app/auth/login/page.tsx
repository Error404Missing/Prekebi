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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/profile")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "შეცდომა მოხდა")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-blue-950">
      <div className="w-full max-w-md">
        <Card className="border-blue-500/20 bg-black/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-400">შესვლა</CardTitle>
            <CardDescription className="text-gray-400">
              შეიყვანეთ თქვენი მონაცემები ანგარიშში შესასვლელად
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
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
                  {isLoading ? "შესვლა..." : "შესვლა"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-gray-400">
                არ გაქვთ ანგარიში?{" "}
                <Link href="/auth/register" className="text-blue-400 underline underline-offset-4 hover:text-blue-300">
                  რეგისტრაცია
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
