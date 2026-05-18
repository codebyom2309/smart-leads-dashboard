import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoginDto } from '../../types';
import { Input } from '../../components/ui/FormElements';
import toast from 'react-hot-toast';

export const LoginPage = (): JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginDto): Promise<void> => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message ?? 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas-soft dark:bg-dark-bg px-4 py-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-glow mb-4">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-ink dark:text-white tracking-tight text-center">
            Welcome back.
          </h1>
          <p className="text-sm text-mute dark:text-gray-500 mt-1 text-center">
            Sign in to your Smart Leads account.
          </p>
        </div>

        {/* Form card */}
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email',
                },
              })}
            />

            <div className="space-y-1.5">
              <label className="form-label">
                Password <span className="text-error ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`form-input pr-10 ${errors.password ? 'border-error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full h-10 mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-mute dark:text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium dark:text-primary-300">
            Create account
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
          <p className="text-xs text-primary-700 dark:text-primary-300 font-mono">
            Demo: admin@smartleads.io / Password123
          </p>
        </div>
      </motion.div>
    </div>
  );
};
