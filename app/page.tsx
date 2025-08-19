"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Music, Volume2 } from "lucide-react"

export default function FriendshipRequest() {
  const [response, setResponse] = useState<"pending" | "yes" | "no" | "scary">("pending")
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 })
  const [isNoButtonMoving, setIsNoButtonMoving] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [scaryAudioLoaded, setScaryAudioLoaded] = useState(false)
  const [showFallingCongrats, setShowFallingCongrats] = useState(false)
  const [noAttemptCount, setNoAttemptCount] = useState(0) // renamed from noClickCount for clarity
  const [allowNoClick, setAllowNoClick] = useState(false) // added state to control when no button can be clicked
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const scaryAudioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const moveNoButton = () => {
    if (!containerRef.current || !noButtonRef.current) return

    const container = containerRef.current.getBoundingClientRect()
    const button = noButtonRef.current.getBoundingClientRect()

    const maxX = container.width - button.width - 40
    const maxY = container.height - button.height - 40

    const newX = Math.max(20, Math.random() * maxX)
    const newY = Math.max(20, Math.random() * maxY)

    setNoButtonPosition({ x: newX, y: newY })
    setIsNoButtonMoving(true)

    setTimeout(() => setIsNoButtonMoving(false), 400)
  }

  const handleYes = async () => {
    setResponse("yes")
    setShowFallingCongrats(true)

    // Play celebration audio
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          await playPromise
          console.log("Celebration audio played successfully")
        }
      } catch (error) {
        console.error("Audio playback failed:", error)
      }
    }
  }

  const handleNoClick = async () => {
    if (!allowNoClick) return // Don't allow click if not ready

    setResponse("scary")

    // Play scary audio
    if (scaryAudioRef.current) {
      try {
        scaryAudioRef.current.currentTime = 0
        const playPromise = scaryAudioRef.current.play()
        if (playPromise !== undefined) {
          await playPromise
          console.log("Scary audio played successfully")
        }
      } catch (error) {
        console.error("Scary audio playback failed:", error)
      }
    }
    // Horror mode now stays permanently active
  }

  const handleNoButtonHover = () => {
    if (!allowNoClick && noAttemptCount < 3) {
      moveNoButton()
      const newCount = noAttemptCount + 1
      setNoAttemptCount(newCount)

      if (newCount >= 3) {
        setAllowNoClick(true)
      }
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    const scaryAudio = scaryAudioRef.current

    const handleAudioLoad = () => {
      setAudioLoaded(true)
      console.log("Celebration audio loaded successfully")
    }

    const handleAudioError = (e: Event) => {
      console.error("Celebration audio failed to load:", e)
      setAudioLoaded(false)
    }

    const handleScaryAudioLoad = () => {
      setScaryAudioLoaded(true)
      console.log("Scary audio loaded successfully")
    }

    const handleScaryAudioError = (e: Event) => {
      console.error("Scary audio failed to load:", e)
      setScaryAudioLoaded(false)
    }

    if (audio) {
      audio.addEventListener("loadeddata", handleAudioLoad)
      audio.addEventListener("error", handleAudioError)
      audio.load() // Force load
    }

    if (scaryAudio) {
      scaryAudio.addEventListener("loadeddata", handleScaryAudioLoad)
      scaryAudio.addEventListener("error", handleScaryAudioError)
      scaryAudio.load() // Force load
    }

    return () => {
      if (audio) {
        audio.removeEventListener("loadeddata", handleAudioLoad)
        audio.removeEventListener("error", handleAudioError)
      }
      if (scaryAudio) {
        scaryAudio.removeEventListener("loadeddata", handleScaryAudioLoad)
        scaryAudio.removeEventListener("error", handleScaryAudioError)
      }
    }
  }, [])

  useEffect(() => {
    if (response === "pending" && containerRef.current) {
      const container = containerRef.current.getBoundingClientRect()
      setNoButtonPosition({
        x: container.width / 2 + 60,
        y: container.height / 2 - 30,
      })
    }
  }, [response])

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 lg:p-8 relative overflow-hidden transition-all duration-1000 ${
        response === "scary"
          ? "bg-gradient-to-br from-red-950 via-black to-gray-950"
          : "bg-gradient-to-br from-slate-950 via-gray-950 to-black"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {response === "scary" ? (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-56 h-56 lg:w-80 lg:h-80 bg-gradient-to-r from-gray-800/40 to-black/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-red-800/30 to-black/30 rounded-full blur-3xl animate-pulse delay-500"></div>
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-56 h-56 lg:w-80 lg:h-80 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          </>
        )}

        <div className="absolute top-10 right-10 lg:right-20 w-20 h-20 lg:w-32 lg:h-32 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"></div>
        <div className="absolute bottom-10 lg:bottom-20 left-10 w-16 h-16 lg:w-24 lg:h-24 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"></div>
        <div className="absolute top-1/3 right-1/3 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-full border border-white/10"></div>
      </div>

      {response === "scary" && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl lg:text-6xl animate-float opacity-80"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 80}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            >
              {["👻", "💀", "🕷️", "🦇", "🕸️"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {showFallingCongrats && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl lg:text-4xl animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {["🎉", "🎊", "✨", "🌟", "💫", "🎈", "🥳", "💚", "🤝", "👏"][Math.floor(Math.random() * 10)]}
            </div>
          ))}
        </div>
      )}

      <audio ref={audioRef} preload="metadata">
        <source src="/celebration.mp3" type="audio/mpeg" />
      </audio>

      <audio ref={scaryAudioRef} preload="metadata">
        <source src="/scary.mp3" type="audio/mpeg" />
      </audio>

      <div
        ref={containerRef}
        className="relative w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-[600px] sm:h-[650px] md:h-[700px] lg:h-[750px] xl:h-[800px] z-10"
      >
        <Card
          className={`absolute inset-0 backdrop-blur-2xl border shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl lg:rounded-3xl transition-all duration-1000 ${
            response === "scary"
              ? "bg-red-950/20 border-red-500/30 shadow-[0_8px_32px_0_rgba(220,38,38,0.5)]"
              : "bg-white/[0.02] border-white/20"
          }`}
        >
          <div
            className={`absolute inset-2 lg:inset-4 rounded-xl lg:rounded-2xl shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.1),inset_0_-2px_4px_0_rgba(0,0,0,0.1)] border transition-all duration-1000 ${
              response === "scary"
                ? "bg-gradient-to-br from-red-950/20 to-black/20 border-red-500/20"
                : "bg-gradient-to-br from-white/[0.05] to-white/[0.02] border-white/10"
            }`}
          >
            <CardContent className="p-6 sm:p-8 lg:p-12 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
              {response === "scary" && (
                <div className="space-y-6 sm:space-y-8 lg:space-y-12 z-10 animate-in fade-in duration-700">
                  <div className="relative animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative text-6xl sm:text-8xl lg:text-9xl p-4 sm:p-6 lg:p-8 bg-red-950/20 backdrop-blur-xl rounded-full border border-red-500/30 shadow-[0_8px_32px_0_rgba(220,38,38,0.5)] animate-bounce">
                      🏚️
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                      YOU DARE SAY NO?!
                    </h1>
                    <div className="p-4 sm:p-6 lg:p-8 bg-red-950/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-red-500/30 shadow-[0_8px_32px_0_rgba(220,38,38,0.5)]">
                      <p className="text-lg sm:text-xl lg:text-2xl text-red-200 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto leading-relaxed font-light">
                        The spirits of the abandoned house are not pleased... You have awakened something dark! 👻💀
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-6">
                      {["💀", "👻", "🕷️", "🦇", "🕸️"].map((emoji, index) => (
                        <div
                          key={index}
                          className={`text-3xl sm:text-4xl lg:text-6xl p-2 sm:p-3 lg:p-4 bg-red-950/20 backdrop-blur-xl rounded-full border border-red-500/30 shadow-[0_8px_32px_0_rgba(220,38,38,0.5)] animate-bounce`}
                          style={{ animationDelay: `${(index + 1) * 150}ms` }}
                        >
                          {emoji}
                        </div>
                      ))}
                    </div>

                    <div className="p-4 sm:p-5 lg:p-6 bg-red-950/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-red-500/30 shadow-[0_8px_32px_0_rgba(220,38,38,0.5)]">
                      <p className="text-red-300 italic text-base sm:text-lg lg:text-xl font-light animate-pulse">
                        The ghosts whisper... "Lets change the decision..." 🌙
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {response === "pending" && (
                <div className="space-y-6 sm:space-y-8 lg:space-y-12 z-10">
                  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-xl"></div>
                      <div className="relative text-4xl sm:text-6xl lg:text-8xl animate-bounce p-3 sm:p-4 lg:p-6 bg-white/5 backdrop-blur-xl rounded-full border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                        👋
                      </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl">
                      Hiiii Luna!
                    </h1>
                    <div className="p-4 sm:p-5 lg:p-6 bg-white/5 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                      <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-xs sm:max-w-md lg:max-w-lg mx-auto leading-relaxed font-light">
                        It's Bashy here! I was wondering... would you like to be my friend?
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-center justify-center">
                    <Button
                      onClick={handleYes}
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500/80 to-green-500/80 backdrop-blur-xl hover:from-emerald-400/90 hover:to-green-400/90 text-white font-semibold px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg shadow-[0_8px_32px_0_rgba(16,185,129,0.37)] hover:shadow-[0_12px_40px_0_rgba(16,185,129,0.5)] transform hover:scale-105 transition-all duration-300 border border-white/20 rounded-xl lg:rounded-2xl w-full sm:w-auto"
                    >
                      <Heart className="mr-2 lg:mr-3" size={18} />
                      Yes, I'd love to!
                    </Button>

                    <Button
                      ref={noButtonRef}
                      onClick={allowNoClick ? handleNoClick : undefined}
                      onMouseEnter={!allowNoClick ? handleNoButtonHover : undefined}
                      onFocus={!allowNoClick ? handleNoButtonHover : undefined}
                      size="lg"
                      className={`bg-white/5 backdrop-blur-xl hover:bg-white/10 text-red-300 font-semibold px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg border border-red-500/30 shadow-[0_8px_32px_0_rgba(239,68,68,0.37)] hover:shadow-[0_12px_40px_0_rgba(239,68,68,0.5)] transition-all duration-400 rounded-xl lg:rounded-2xl w-full sm:w-auto ${
                        isNoButtonMoving ? "transform scale-110 rotate-12" : ""
                      } ${allowNoClick ? "cursor-pointer hover:bg-red-500/20" : "cursor-default"}`}
                      style={{
                        position: "absolute",
                        left: `${noButtonPosition.x}px`,
                        top: `${noButtonPosition.y}px`,
                        transition: isNoButtonMoving ? "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "none",
                      }}
                    >
                      {allowNoClick ? "No way... (Click me!)" : "No way..."}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 lg:gap-3 p-3 lg:p-4 bg-white/5 backdrop-blur-xl rounded-lg lg:rounded-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                    <Volume2 size={16} className="lg:size-[18px] text-gray-300" />
                    <span className="text-gray-300 text-xs sm:text-sm font-medium">
                      {audioLoaded ? "Audio ready" : "Loading audio..."}
                    </span>
                    {noAttemptCount > 0 && (
                      <span className="text-gray-400 text-xs ml-2">
                        Attempts: {noAttemptCount}/3 {allowNoClick && "(Ready to click!)"}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {response === "yes" && (
                <div className="space-y-6 sm:space-y-8 lg:space-y-12 z-10 animate-in fade-in duration-700">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative text-5xl sm:text-7xl lg:text-9xl animate-bounce p-4 sm:p-6 lg:p-8 bg-white/10 backdrop-blur-xl rounded-full border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                      🎉
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent drop-shadow-2xl">
                      AMAZING!
                    </h1>
                    <div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                      <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto leading-relaxed font-light">
                        Luna, you just made Bashy the happiest person!
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 p-3 lg:p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-xl rounded-lg lg:rounded-xl border border-emerald-500/30 shadow-[0_8px_32px_0_rgba(16,185,129,0.37)]">
                      <Music size={20} className="sm:size-6 animate-pulse text-emerald-300" />
                      <span className="text-sm sm:text-base lg:text-lg text-emerald-200 font-medium">
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-6">
                    {["💚", "🤝", "✨", "🎈", "🌟"].map((emoji, index) => (
                      <div
                        key={index}
                        className={`text-2xl sm:text-3xl lg:text-5xl p-2 sm:p-3 lg:p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] animate-bounce`}
                        style={{ animationDelay: `${(index + 1) * 100}ms` }}
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 sm:p-5 lg:p-6 bg-white/5 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                    <p className="text-gray-300 italic text-base sm:text-lg lg:text-xl font-light">
                      Yaaayyyy we are friendsss! 👫
                    </p>
                  </div>
                </div>
              )}

              {response === "no" && (
                <div className="space-y-6 sm:space-y-8 lg:space-y-10 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative text-4xl sm:text-6xl lg:text-8xl p-3 sm:p-4 lg:p-6 bg-white/5 backdrop-blur-xl rounded-full border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] animate-pulse">
                      😢
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 lg:p-6 bg-white/5 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-200 mb-3 lg:mb-4">
                      That's okay...
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-300 font-light">
                      But you'll never catch that button anyway! 😏
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}
