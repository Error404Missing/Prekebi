"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, KeyRound } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [hasApprovedTeam, setHasApprovedTeam] = useState(false)
  const [roomInfo, setRoomInfo] = useState<{
    room_id: string | null
    room_password: string | null
    start_time: string | null
    map: string | null
  } | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const checkUserStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log("[v0] Current user:", user?.email)
      setUser(user)

      if (user) {
        const { data, error } = await supabase.from("profiles").select("is_admin, role").eq("id", user.id).single()

        console.log("[v0] User check result:", data, "Error:", error)
        setIsAdmin(data?.is_admin || false)

        const { data: teamData } = await supabase
          .from("teams")
          .select("id, status")
          .eq("leader_id", user.id)
          .eq("status", "approved")
          .single()

        console.log("[v0] Team check result:", teamData)
        const hasTeam = !!teamData
        setHasApprovedTeam(hasTeam)

        if (hasTeam) {
          const { data: settingsData } = await supabase
            .from("site_settings")
            .select("key, value")
            .in("key", ["room_id", "room_password", "start_time", "map"])

          if (settingsData) {
            const roomData = {
              room_id: settingsData.find((s) => s.key === "room_id")?.value || "",
              room_password: settingsData.find((s) => s.key === "room_password")?.value || "",
              start_time: settingsData.find((s) => s.key === "start_time")?.value || "",
              map: settingsData.find((s) => s.key === "map")?.value || "",
            }

            if (roomData.room_id || roomData.room_password || roomData.start_time || roomData.map) {
              setRoomInfo(roomData)
            }
          }
        } else {
          setRoomInfo(null)
        }
      } else {
        setIsAdmin(false)
        setHasApprovedTeam(false)
        setRoomInfo(null)
      }
    }

    checkUserStatus()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[v0] Auth state changed:", session?.user?.email)
      setUser(session?.user || null)
      if (session?.user) {
        checkUserStatus()
      } else {
        setIsAdmin(false)
        setHasApprovedTeam(false)
        setRoomInfo(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    console.log("[v0] isAdmin state:", isAdmin, "hasApprovedTeam:", hasApprovedTeam)
  }, [isAdmin, hasApprovedTeam])

  const navItems = [
    { href: "/", label: "მთავარი" },
    { href: "/schedule", label: "განრიგი" },
    { href: "/teams", label: "გუნდები" },
    { href: "/results", label: "შედეგები" },
    { href: "/case-opening", label: "Case", special: "case" },
    { href: "/blocked", label: "დაბლოკილი" },
    { href: "/vip", label: "VIP", special: "vip" },
    { href: "/help", label: "დახმარება" },
    { href: "/rules", label: "წესები" },
    { href: "/contact", label: "კონტაქტი" },
  ]

  const adminItems = [
    { href: "/admin", label: "ადმინ პანელი" },
    { href: "/admin/teams", label: "გუნდების მართვა" },
    { href: "/admin/schedule", label: "განრიგის მართვა" },
    { href: "/admin/results", label: "შედეგების მართვა" },
    { href: "/admin/rules", label: "წესების მართვა" },
    { href: "/admin/settings", label: "პარამეტრები" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur-xl shadow-lg shadow-black/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-blue-500 transition-all">
              PUBG SCRIMS
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  item.special === "case"
                    ? pathname === item.href
                      ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-black shadow-lg shadow-amber-500/40 font-bold"
                      : "relative overflow-hidden bg-gradient-to-r from-amber-600/30 via-yellow-500/20 to-orange-600/30 text-amber-300 hover:text-amber-200 border border-amber-500/50 hover:border-amber-400/70 hover:shadow-lg hover:shadow-amber-500/20"
                    : item.special === "vip"
                      ? pathname === item.href
                        ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/40 font-bold"
                        : "relative overflow-hidden bg-gradient-to-r from-purple-600/30 via-pink-500/20 to-purple-600/30 text-purple-300 hover:text-purple-200 border border-purple-500/50 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-500/20"
                      : pathname === item.href
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                }`}
              >
                {item.special === "case" && (
                  <span className="text-base animate-bounce">🎁</span>
                )}
                {item.special === "vip" && (
                  <span className="text-base">👑</span>
                )}
                {item.label}
              </Link>
            ))}
            {hasApprovedTeam && (
              <Link
                href="/room-info"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  pathname === "/room-info"
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                    : "text-purple-400 hover:bg-gray-900 hover:text-purple-300"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                Room Info
              </Link>
            )}
            {isAdmin && (
              <div className="relative group">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith("/admin")
                      ? "bg-gradient-to-r from-yellow-600 to-orange-500 text-white shadow-lg shadow-yellow-500/30"
                      : "text-yellow-400 hover:bg-gray-900 hover:text-yellow-300"
                  }`}
                >
                  ადმინი ▼
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {adminItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-400 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-3">
            {user ? (
              <>
                <Button asChild variant="ghost" className="text-gray-400 hover:text-gray-200 hover:bg-gray-900">
                  <Link href="/profile">პროფილი</Link>
                </Button>
                <Button
                  onClick={async () => {
                    await handleLogout()
                    setIsOpen(false)
                  }}
                  variant="ghost"
                  className="text-gray-400 hover:text-red-400 hover:bg-gray-900"
                >
                  გასვლა
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-gray-400 hover:text-gray-200 hover:bg-gray-900">
                  <Link href="/auth/login">შესვლა</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20"
                >
                  <Link href="/auth/register">რეგისტრაციя</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-400 hover:text-gray-200 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    item.special === "case"
                      ? pathname === item.href
                        ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-black font-bold"
                        : "bg-gradient-to-r from-amber-600/30 to-orange-600/30 text-amber-300 border border-amber-500/50"
                      : item.special === "vip"
                        ? pathname === item.href
                          ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-bold"
                          : "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-300 border border-purple-500/50"
                        : pathname === item.href
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400"
                  }`}
                >
                  {item.special === "case" && <span>🎁</span>}
                  {item.special === "vip" && <span>👑</span>}
                  {item.label}
                </Link>
              ))}
              {hasApprovedTeam && (
                <Link
                  href="/room-info"
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    pathname === "/room-info"
                      ? "bg-purple-600 text-white"
                      : "text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  Room Info
                </Link>
              )}
              {isAdmin && (
                <div className="pt-2 border-t border-gray-800">
                  <div className="text-xs text-yellow-400 px-3 py-1 font-semibold">ადმინ პანელი</div>
                  {adminItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-yellow-600 text-white"
                          : "text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
              <div className="pt-2 border-t border-gray-800">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-200"
                    >
                      პროფილი
                    </Link>
                    <button
                      onClick={async () => {
                        await handleLogout()
                        setIsOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400"
                    >
                      გასვლა
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-200"
                    >
                      შესვლა
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      რეგისტრაციя
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

const handleLogout = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
}
