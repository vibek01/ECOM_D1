import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { LoginSchema, type TLoginSchema } from '../lib/validators';
import { loginUser } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Spinner } from '../components/common/Spinner';

export const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: TLoginSchema) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (user) {
      // Role-based redirection
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Input
                id="email-address"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                {...register('email')}
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                {...register('password')}
              />
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          {status === 'failed' && error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          <div>
            <Button type="submit" className="w-full" disabled={status === 'loading'}>
              {status === 'loading' ? <Spinner size="sm" color="light" /> : 'Sign in'}
            </Button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600">
          Not a member?{' '}
          <Link to="/register" className="font-medium text-slate-800 hover:text-slate-600">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};