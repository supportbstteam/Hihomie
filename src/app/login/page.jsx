'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/uiSlice'
import toast from "react-hot-toast"
import { CiMail, CiLock } from "react-icons/ci";
import Spinner from '@/components/Spinner'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const loading = useSelector(s => s.ui.loading)
  const dispatch = useDispatch()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    dispatch(setLoading(true))
    const res = await signIn('credentials', { redirect: false, email, password })
    dispatch(setLoading(false))
    if (res?.ok) {
      toast.success("Login success")
      router.push('/dashboard')
    } else {
      toast.error("Invalid credentials")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#E9F8F1] px-4">
      {/* Logo */}
      <img
        src={`${process.ENV}/logo.png`}
        alt="Logo"
        className="mb-4 w-32 sm:w-40 md:w-48"
      />

      {/* Login Form */}
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Bienvenido de nuevo</h1>
        <p className="mb-6 text-center text-[#666]">Conexión rápida con su gerente o agente</p>

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Email */}
          <div className="relative flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Correo electrónico*</label>
            <input
              className="w-full rounded-lg border px-10 py-2 focus:border-[#21b573] focus:ring focus:ring-[#21b573]/20"
              placeholder="Tu Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <CiMail className="absolute left-3 top-[70%] -translate-y-1/2 text-gray-400 text-lg" />
          </div>

          {/* Password */}
          <div className="relative flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Contraseña*</label>
            <input
              className="w-full rounded-lg border px-10 py-2 focus:border-[#21b573] focus:ring focus:ring-[#21b573]/20"
              placeholder="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <CiLock className="absolute left-3 top-[70%] -translate-y-1/2 text-gray-400 text-lg" />
            <span
              className="absolute right-3 top-[70%] -translate-y-1/2 cursor-pointer text-gray-500 text-lg"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-between text-sm">
            <div>
              <input type="checkbox" name="remember" className="mr-1" />
              <label className="text-[#99A1B7]">Recuérdame</label>
            </div>
            <div>
              <a href="#" className="text-[#99A1B7]">Olvidaste tu contraseña?</a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#21b573] px-4 py-2 font-medium text-white disabled:opacity-60"
          >
              "Iniciar sesión"
          </button>
        </form>
      </div>
    </div>

  )
}

