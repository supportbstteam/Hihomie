'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CiMail } from 'react-icons/ci'
import toast from 'react-hot-toast'
import { t } from '@/components/translations'
import { forgot_password } from '@/store/customer'

const ForgotePassword = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({ email: '' })
  const { loader, successMessage, errorMessage } = useSelector(state => state.customer)
  const dispatch = useDispatch()

  const validateForm = () => {
    let newErrors = { email: '' }
    let valid = true

    if (!email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    dispatch(forgot_password(email))
  }

  useEffect(() => {
    if (successMessage) toast.success(successMessage)
    if (errorMessage) toast.error(errorMessage)
  }, [successMessage, errorMessage])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#E9F8F1] px-4">
      {/* Logo */}
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
        alt="Logo"
        className="mb-4 w-32 sm:w-40 md:w-48"
      />

      {/* Form Card */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Olvidar contraseña</h1>
        <p className="mb-6 text-center text-[#666]">
          Ingrese el correo electrónico de su cuenta.
        </p>

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Email Field */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Correo electrónico*
            </label>
            <div
              className={`flex items-center border rounded-lg px-3 h-12 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <CiMail className="text-gray-400 text-lg mr-2" />
              <input
                className="flex-1 outline-none"
                placeholder="Tu Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loader}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#21b573] px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {loader ? t('loading') : 'Iniciar sesión'}
          </button>

          {/* Back to Login */}
          <div className="text-center text-[#99A1B7]">
            <a href="/">Volver a iniciar sesión</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotePassword
