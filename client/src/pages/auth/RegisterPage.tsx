import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RegisterDto } from '../../types';
import { Input, Select } from '../../components/ui/FormElements';
import toast from 'react-hot-toast';

export const RegisterPage = (): JSX.Element => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDto & { confirmPassword: string }>({
    defaultValues: { name: '', email: '', password: '', role: 'sales' },
  });

  const onSubmit = async (data: RegisterDto & { confirmPassword: string }): Promise<void> => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message ?? 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas-soft dark:bg-dark-bg px-4 py-12">
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-glow mb-4">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-ink dark:text-white tracking-tight text-center">
            Create your account.
          </h1>
          <p className="text-sm text-mute dark:text-gray-500 mt-1 text-center">
            Start managing your leads professionally.
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Full Name"
              placeholder="Jane Smith"
              required
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
            />

            <div className="space-y-1.5">
              <label className="form-label">
                Password <span className="text-error ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className={`form-input pr-10 ${errors.password ? 'border-error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must include uppercase, lowercase, and number',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-ink"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <Select
              label="Role"
              options={[
                { value: 'sales', label: 'Sales User' },
                { value: 'admin', label: 'Administrator' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />

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
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-mute dark:text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium dark:text-primary-300">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
