'use client'
import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/uiSlice'
import toast from "react-hot-toast"
import { CiMail, CiLock } from "react-icons/ci";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { t } from '@/components/translations';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })
  const loading = useSelector(s => s.ui.loading)
  const dispatch = useDispatch()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const { data: session, status } = useSession()

  useEffect(() => {
    localStorage.setItem("hi_home_trans", "en");

    const savedEmail = localStorage.getItem("rememberEmail")
    const savedPassword = localStorage.getItem("rememberPassword")

    if (savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/dashboard')
    }
  }, [status, router])

  const validateForm = () => {
    let newErrors = { email: '', password: '' }
    let valid = true

    if (!email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email"
      valid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return

    dispatch(setLoading(true))
    const res = await signIn('credentials', { redirect: false, email, password })
    dispatch(setLoading(false))

    if (res?.ok) {
      toast.success("Login success")
      if (rememberMe) {
        localStorage.setItem("rememberEmail", email)
        localStorage.setItem("rememberPassword", password)
      } else {
        localStorage.removeItem("rememberEmail")
        localStorage.removeItem("rememberPassword")
      }
      router.push('/dashboard')
    } else {
      toast.error("Invalid credentials")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#E9F8F1] px-4">
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
        alt="Logo"
        className="mb-4 w-32 sm:w-40 md:w-48"
      />

      <div className="w-full max-w-md rounded-2xl border border-stroke bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center">{t('welcome_back')}</h1>
        <p className="mb-6 text-center text-[#666]">{t('login_quick')}</p>

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Correo electrónico*
            </label>
            <div
              className={`flex items-center border rounded-lg px-3 h-12 ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
            >
              <CiMail className="text-gray-400 mr-2 text-lg" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 py-2 outline-none"
                placeholder="Correo electrónico"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Contraseña*
            </label>
            <div
              className={`flex items-center border rounded-lg px-3 h-12 ${errors.password ? "border-red-500" : "border-gray-300"
                }`}
            >
              <CiLock className="text-gray-400 mr-2 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 py-2 outline-none"
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-lg" />
                ) : (
                  <AiOutlineEye className="text-lg" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex justify-between text-sm">
            <div>
              <input
                type="checkbox"
                name="remember"
                className="mr-1"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="text-[#99A1B7]">{t('remember')}</label>
            </div>
            <div>
              <a href="/forgot-password" className="text-[#99A1B7]">{t('forget_password')}?</a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#21b573] px-4 py-2 font-medium text-white hover:bg-[#1aa267] transition"
          >
            {loading ? t('loading') : t('login')}
          </button>
        </form>
      </div>
    </div>
  )
}


