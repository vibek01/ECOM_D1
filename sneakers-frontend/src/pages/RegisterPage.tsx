import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterSchema, type TRegisterSchema } from '../lib/validators';
import { registerUser } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Spinner } from '../components/common/Spinner';

export const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: TRegisterSchema) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      // On successful registration, redirect to login page
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <Input placeholder="Username" {...register('username')} />
            {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
            <Input type="email" placeholder="Email address" {...register('email')} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            <Input type="password" placeholder="Password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {status === 'failed' && error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          <div>
            <Button type="submit" className="w-full" disabled={status === 'loading'}>
              {status === 'loading' ? <Spinner size="sm" color="light" /> : 'Sign up'}
            </Button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-slate-800 hover:text-slate-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};