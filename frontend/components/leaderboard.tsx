"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Calendar, Clock, TrendingUp, RefreshCw } from "lucide-react"
import { apiService, type User } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

type SortType = "global" | "weekly" | "daily"

interface LeaderboardUser extends User {
  rank?: number
}

export function Leaderboard() {
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState<SortType>("global")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les données du leaderboard
  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getLeaderboard()

      if (response.data) {
        // Ajouter les rangs aux utilisateurs
        const usersWithRanks = response.data.map((user, index) => ({
          ...user,
          rank: index + 1
        }))
        setLeaderboardData(usersWithRanks)
      } else {
        setError(response.error || "Erreur lors du chargement du leaderboard")
      }
    } catch (err) {
      setError("Erreur lors du chargement du leaderboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchLeaderboard()
    }
  }, [user])

  // Les données sont déjà triées par score descendant depuis le backend
  const sortedData = leaderboardData

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-slate-400 font-bold">#{rank}</span>
    }
  }

  const getScoreByType = (player: LeaderboardUser) => {
    return player.score // Pour l'instant on utilise juste le score global
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Classement</h1>
          <p className="text-slate-400 text-lg">Connectez-vous pour voir le classement</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Classement</h1>
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-400" />
            <span className="text-slate-400">Chargement du classement...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Classement</h1>
          <div className="text-red-400">{error}</div>
          <Button onClick={fetchLeaderboard} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Classement</h1>
        <p className="text-slate-400 text-lg">Découvrez les meilleurs joueurs de Lodle</p>
      </div>

      {/* Refresh Button */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <Button
              onClick={fetchLeaderboard}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Classement Global</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-300 font-medium">Rang</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Joueur</th>
                  <th className="text-center p-4 text-slate-300 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((player, index) => (
                  <tr
                    key={player.id}
                    className={`border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors ${
                      user?.id === player.id ? 'bg-blue-900/20' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-2">{getRankIcon(player.rank || index + 1)}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {player.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{player.username}</span>
                          {user?.id === player.id && (
                            <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                              Vous
                            </Badge>
                          )}
                          {index < 3 && (
                            <Badge variant="secondary" className="text-xs">
                              TOP {index + 1}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-blue-400">
                        {player.score.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {leaderboardData.length > 0 ? leaderboardData[0].score.toLocaleString() : '0'}
            </div>
            <div className="text-blue-300">Meilleur Score</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{leaderboardData.length}</div>
            <div className="text-purple-300">Joueurs Total</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
          <CardContent className="p-6 text-center">
            <Medal className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {user ? `#${leaderboardData.findIndex(p => p.id === user.id) + 1 || '?'}` : '-'}
            </div>
            <div className="text-green-300">Votre Rang</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
