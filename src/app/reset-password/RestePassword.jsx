'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation' // ✅ correct import
import toast from "react-hot-toast"
import { CiLock } from "react-icons/ci";
import { reset_password } from '@/store/customer';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { loading, successMessage, errorMessage } = useSelector(state => state.customer);
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ Works in Client Component
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    dispatch(reset_password({ password, token }));
  }

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setTimeout(() => {
        router.push('/'); // ✅ Redirect
      }, 2000);
    }
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#E9F8F1] px-4">
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
        alt="Logo"
        className="mb-4 w-32 sm:w-40 md:w-48"
      />
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Restablecer contraseña</h1>
        <p className="mb-6 text-center text-[#666]">Ingresa tu nueva contraseña.</p>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="relative flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Nueva contraseña*</label>
            <input
              className="w-full rounded-lg border px-10 py-2 focus:border-[#21b573] focus:ring focus:ring-[#21b573]/20"
              placeholder="Nueva contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <CiLock className="absolute left-3 top-[70%] -translate-y-1/2 text-gray-400 text-lg" />
          </div>
          <div className="relative flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Confirmar contraseña*</label>
            <input
              className="w-full rounded-lg border px-10 py-2 focus:border-[#21b573] focus:ring focus:ring-[#21b573]/20"
              placeholder="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <CiLock className="absolute left-3 top-[70%] -translate-y-1/2 text-gray-400 text-lg" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#21b573] px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            Restablecer contraseña
          </button>
          <div className='text-center text-[#99A1B7]'>
            <a href='/'>Volver a iniciar sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
