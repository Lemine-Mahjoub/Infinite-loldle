"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Check, X, MapPin, Shield, Trophy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import champsData from "../../backend/src/data/Champs.json"
import { apiService, type User } from "@/lib/api"
import { useAuthState } from "@/hooks/useAuth"
import { AuthForms } from "./auth-forms"

// Transformation des données des champions
const champions = champsData.champs.map((champ, index) => ({
  id: index + 1,
  name: champ.name,
  region: Array.isArray(champ.region) ? champ.region.join(", ") : champ.region,
  role: champ.role,
  position: Array.isArray(champ.position) ? champ.position.join(", ") : champ.position,
  image: champ.image,
  mana: champ.mana,
  date: champ.date
}))

// Fonction pour calculer les points
const calculatePoints = (attemptNumber: number): number => {
  return Math.floor(100 / Math.pow(2, attemptNumber - 1))
}

export function GuessTheChampion() {
  const { user, refreshUser } = useAuthState()
  const [searchTerm, setSearchTerm] = useState("")
  const [guesses, setGuesses] = useState<typeof champions>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [targetChampion, setTargetChampion] = useState<typeof champions[0] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Clés pour localStorage
  const getStorageKey = (userId: number, suffix: string) => `loldle_${userId}_${suffix}`

  // Sauvegarder dans localStorage
  const saveToStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined' && user) {
      try {
        localStorage.setItem(getStorageKey(user.id, key), JSON.stringify(data))
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
      }
    }
  }

  // Charger depuis localStorage
  const loadFromStorage = (key: string) => {
    if (typeof window !== 'undefined' && user) {
      try {
        const stored = localStorage.getItem(getStorageKey(user.id, key))
        return stored ? JSON.parse(stored) : null
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        return null
      }
    }
    return null
  }

  // Nettoyer localStorage pour un nouveau jeu
  const clearGameStorage = () => {
    if (typeof window !== 'undefined' && user) {
      localStorage.removeItem(getStorageKey(user.id, 'guesses'))
      localStorage.removeItem(getStorageKey(user.id, 'targetChampion'))
      localStorage.removeItem(getStorageKey(user.id, 'gameWon'))
    }
  }

  // Fonction pour demander un nouveau champion
  const handleNewGame = async () => {
    try {
      setLoading(true)
      const response = await apiService.getNewChampion()

      if (response.data) {
        // Nettoyer le localStorage pour le nouveau jeu
        clearGameStorage()

        // Trouver le nouveau champion dans nos données
        const newChampion = champions.find(c => c.name === response.data?.champ)
        if (newChampion) {
          setTargetChampion(newChampion)
          setGuesses([])
          setGameWon(false)
          setError(null)

          // Sauvegarder le nouveau champion
          saveToStorage('targetChampion', newChampion)

          await refreshUser()
        }
      }
    } catch (error) {
      console.error('Erreur lors du nouveau jeu:', error)
      setError("Erreur lors du chargement d'un nouveau champion")
    } finally {
      setLoading(false)
    }
  }

  // Charger les données depuis localStorage et le champion assigné à l'utilisateur
  useEffect(() => {
    if (user?.champ) {
      // Essayer de charger les données sauvegardées
      const savedTarget = loadFromStorage('targetChampion')
      const savedGuesses = loadFromStorage('guesses')
      const savedGameWon = loadFromStorage('gameWon')

      // Vérifier si les données sauvegardées correspondent au champion actuel de l'utilisateur
      if (savedTarget && savedTarget.name === user.champ) {
        // Restaurer l'état du jeu
        setTargetChampion(savedTarget)
        if (savedGuesses) setGuesses(savedGuesses)
        if (savedGameWon) setGameWon(savedGameWon)
      } else {
        // Nettoyer le localStorage si le champion a changé
        clearGameStorage()

        // Charger le nouveau champion
        const champion = champions.find(c => c.name === user.champ)
        if (champion) {
          setTargetChampion(champion)
          saveToStorage('targetChampion', champion)
        }
      }
      setLoading(false)
    }
  }, [user])

  // Sauvegarder les guesses à chaque changement
  useEffect(() => {
    if (user && guesses.length > 0) {
      saveToStorage('guesses', guesses)
    }
  }, [guesses, user])

  // Sauvegarder l'état de victoire
  useEffect(() => {
    if (user) {
      saveToStorage('gameWon', gameWon)
    }
  }, [gameWon, user])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="text-white">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Devinez le Champion</h1>
          <p className="text-slate-400 text-lg">Connectez-vous pour commencer à jouer !</p>
        </div>
        <AuthForms />
      </div>
    )
  }

  if (!targetChampion) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Aucun champion assigné</h1>
          <p className="text-slate-400 text-lg">Demandez un nouveau champion à deviner !</p>
          <Button
            onClick={handleNewGame}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Obtenir un Champion
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  const filteredChampions = champions.filter(
    (champion) =>
      champion.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !guesses.some((guess) => guess.id === champion.id),
  )

  const handleGuess = async (champion: typeof champions[0]) => {
    const newGuesses = [...guesses, champion]
    setGuesses(newGuesses)
    setSearchTerm("")
    setShowSuggestions(false)

    if (champion.name === targetChampion.name) {
      // Victoire !
      const points = calculatePoints(newGuesses.length)

      try {
        // Envoyer les points au backend
        const response = await apiService.checkChampionAnswer(champion, points)

        if (response.data?.correct) {
          setGameWon(true)
          // Rafraîchir les données utilisateur pour avoir le nouveau score
          await refreshUser()
          // Note: On ne génère plus automatiquement un nouveau champion
          // L'utilisateur devra cliquer sur le bouton "Nouveau Champion"
        }
      } catch (error) {
        console.error('Erreur lors de la validation:', error)
        setError("Erreur lors de la validation de la réponse")
      }
    }
  }

  const getMatchStatus = (guess: typeof champions[0], target: typeof champions[0]) => {
    return {
      name: guess.name === target.name,
      region: guess.region === target.region,
      role: guess.role === target.role,
      position: guess.position === target.position,
      mana: guess.mana === target.mana,
      date: guess.date === target.date,
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Devinez le Champion</h1>
        <p className="text-slate-400 text-lg">Trouvez le champion mystère en analysant les indices !</p>

        {/* Score et Points */}
        <div className="flex justify-center items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-white font-medium">Score: {user.score}</span>
          </div>
          {!gameWon && (
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">P</span>
              </div>
              <span className="text-green-400 font-medium">
                Points possibles: {calculatePoints(guesses.length + 1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-700">
          <CardContent className="p-4 text-center">
            <p className="text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Tapez le nom d'un champion..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowSuggestions(e.target.value.length > 0)
                }}
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                className="pl-10 h-12 text-lg bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                disabled={gameWon}
              />
            </div>

            {/* Suggestions */}
            {showSuggestions && filteredChampions.length > 0 && !gameWon && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                {filteredChampions.slice(0, 10).map((champion) => (
                  <button
                    key={champion.id}
                    onClick={() => handleGuess(champion)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-slate-700 transition-colors text-left"
                  >
                    <Image
                      src={champion.image}
                      alt={champion.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="text-white font-medium">{champion.name}</div>
                      <div className="text-slate-400 text-sm">
                        {champion.region} • {champion.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game Won Message */}
      {gameWon && (
        <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-400 mb-2">
              <Check className="h-6 w-6" />
              <span className="text-xl font-bold">Félicitations !</span>
            </div>
            <p className="text-green-300">
              Vous avez trouvé le champion en {guesses.length} essai{guesses.length > 1 ? "s" : ""} !
            </p>
            <p className="text-green-400 font-medium">
              +{calculatePoints(guesses.length)} points gagnés !
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <Image
                src={targetChampion.image}
                alt={targetChampion.name}
                width={64}
                height={64}
                className="rounded-full border-2 border-green-400"
              />
              <div className="text-left">
                <div className="text-white font-bold text-lg">{targetChampion.name}</div>
                <div className="text-green-300">{targetChampion.region} • {targetChampion.role}</div>
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleNewGame}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Nouveau Champion
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guesses History */}
      {guesses.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <span>Historique des essais</span>
              <Badge variant="secondary">{guesses.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {guesses.map((guess, index) => {
              const status = getMatchStatus(guess, targetChampion)
              return (
                <div
                  key={`${guess.id}-${index}`}
                  className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg"
                >
                  <Image
                    src={guess.image}
                    alt={guess.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{guess.name}</span>
                      {status.name ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className={status.region ? "text-green-400" : "text-slate-300"}>{guess.region}</span>
                      {status.region ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-slate-400" />
                      <span className={status.role ? "text-green-400" : "text-slate-300"}>{guess.role}</span>
                      {status.role ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-white">P</span>
                      </div>
                      <span className={status.position ? "text-green-400" : "text-slate-300"}>{guess.position}</span>
                      {status.position ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-white">M</span>
                      </div>
                      <span className={status.mana ? "text-green-400" : "text-slate-300"}>{guess.mana}</span>
                      {status.mana ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gradient-to-r from-orange-500 to-red-600 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-white">📅</span>
                      </div>
                      <span className={status.date ? "text-green-400" : "text-slate-300"}>{guess.date}</span>
                      {status.date ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}


    </div>
  )
}
