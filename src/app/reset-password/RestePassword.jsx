'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from "react-hot-toast"
import { CiLock } from "react-icons/ci";
import { reset_password } from '@/store/customer';
import { t } from '@/components/translations';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });

  const { loader, successMessage, errorMessage } = useSelector(state => state.customer);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const validateForm = () => {
    let newErrors = { password: '', confirmPassword: '' };
    let valid = true;

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
      valid = false;
    } else if (confirmPassword.length < 6) {
      newErrors.confirmPassword = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    dispatch(reset_password({ password, token }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setTimeout(() => router.push('/'), 2000);
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
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Restablecer contraseña</h1>
        <p className="mb-6 text-center text-[#666]">Ingresa tu nueva contraseña.</p>

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Password Field */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">Nueva contraseña*</label>
            <div
              className={`flex items-center border rounded-lg px-3 h-12 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <CiLock className="text-gray-400 text-lg mr-2" />
              <input
                className="flex-1 outline-none"
                placeholder="Nueva contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="mb-1 block font-medium text-gray-700">Confirmar contraseña*</label>
            <div
              className={`flex items-center border rounded-lg px-3 h-12 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <CiLock className="text-gray-400 text-lg mr-2" />
              <input
                className="flex-1 outline-none"
                placeholder="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loader}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#21b573] px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {loader ? t('loading') : 'Restablecer contraseña'}
          </button>

          <div className="text-center text-[#99A1B7]">
            <a href="/">Volver a iniciar sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
