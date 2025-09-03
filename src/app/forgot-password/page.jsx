'use client'
import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/uiSlice'
import toast from "react-hot-toast"
import { CiMail } from "react-icons/ci";
import { t } from '@/components/translations';
import { Link } from 'lucide-react'
import { forgot_password } from '@/store/customer'

const ForgotePassword = () => {

    
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const {loading,  successMessage, errorMessage} = useSelector(state => state.customer)
    const dispatch = useDispatch()

    async function onSubmit(e) {
    e.preventDefault()
    dispatch(forgot_password(email))
    }

    useEffect(()=>{

       if(successMessage){
          toast.success(successMessage)
       }

       if(errorMessage){
         toast.error(errorMessage)
       }
    },[successMessage,errorMessage])
    

  return (
     <div className="flex min-h-screen flex-col items-center justify-center bg-[#E9F8F1] px-4">
          {/* Logo */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
            alt="Logo"
            className="mb-4 w-32 sm:w-40 md:w-48"
          />
    
          {/* Login Form */}
          <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-center">Olvidar contraseña</h1>
            <p className="mb-6 text-center text-[#666]">Ingrese el correo electrónico de su cuenta.</p>
    
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

              {error && <p className="text-sm text-red-600">{error}</p>}

    
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#21b573] px-4 py-2 font-medium text-white disabled:opacity-60"
              >
                {loading ? t('loading') :"Iniciar sesión"}
                  
              </button>

              <div className='text-center text-[#99A1B7]'><a href='/'>Volver a iniciar sesión</a></div>
            </form>
          </div>
        </div>
    
  )
}

export default ForgotePassword