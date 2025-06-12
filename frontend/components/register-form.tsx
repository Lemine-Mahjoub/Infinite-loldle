"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Lock, UserPlus, Check, X } from "lucide-react"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.username.length < 3) {
      newErrors.username = "Le pseudo doit contenir au moins 3 caractères"
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Adresse email invalide"
    }

    if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulation d'une requête d'inscription
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "" }
    if (password.length < 6) return { strength: 1, label: "Faible" }
    if (password.length < 10) return { strength: 2, label: "Moyen" }
    return { strength: 3, label: "Fort" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-blue-600">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Inscription</h1>
          <p className="text-slate-400">Créez votre compte pour rejoindre la communauté Lodle</p>
        </div>

        {/* Register Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-white">Créer un compte</CardTitle>
            <CardDescription className="text-slate-400">Remplissez les informations ci-dessous</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  Pseudo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="VotrePseudo"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 ${
                      errors.username ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {formData.username.length >= 3 && !errors.username && (
                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                  )}
                </div>
                {errors.username && (
                  <p className="text-red-400 text-sm flex items-center space-x-1">
                    <X className="h-3 w-3" />
                    <span>{errors.username}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Adresse email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {formData.email.includes("@") && !errors.email && (
                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm flex items-center space-x-1">
                    <X className="h-3 w-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    required
                  />
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full transition-all ${
                            passwordStrength.strength === 1
                              ? "w-1/3 bg-red-500"
                              : passwordStrength.strength === 2
                                ? "w-2/3 bg-yellow-500"
                                : passwordStrength.strength === 3
                                  ? "w-full bg-green-500"
                                  : "w-0"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-400 text-sm flex items-center space-x-1">
                    <X className="h-3 w-3" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm flex items-center space-x-1">
                    <X className="h-3 w-3" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Création du compte...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Créer mon compte</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms Notice */}
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <p className="text-slate-400 text-xs">
              En créant un compte, vous acceptez nos{" "}
              <Link href="#" className="text-blue-400 hover:text-blue-300">
                Conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="#" className="text-blue-400 hover:text-blue-300">
                Politique de confidentialité
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
