import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  avatar: string;
  password: string;
}

interface AuthProps {
  onLogin: (user: UserData) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    avatar: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData({ ...formData, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'register') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Введите имя';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Введите фамилию';
      }
      if (!formData.username.trim()) {
        newErrors.username = 'Введите имя пользователя';
      } else if (formData.username.length < 5) {
        newErrors.username = 'Минимум 5 символов';
      }
      if (!formData.password) {
        newErrors.password = 'Введите пароль';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Минимум 6 символов';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }
    } else {
      if (!formData.username.trim()) {
        newErrors.username = 'Введите имя пользователя';
      }
      if (!formData.password) {
        newErrors.password = 'Введите пароль';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (mode === 'register') {
      const userData: UserData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        bio: formData.bio,
        avatar: formData.avatar,
        password: formData.password,
      };
      localStorage.setItem('tunzok_user', JSON.stringify(userData));
      onLogin(userData);
    } else {
      const savedUser = localStorage.getItem('tunzok_user');
      if (savedUser) {
        const user: UserData = JSON.parse(savedUser);
        if (user.username === formData.username && user.password === formData.password) {
          onLogin(user);
        } else {
          setErrors({ password: 'Неверное имя пользователя или пароль' });
        }
      } else {
        setErrors({ password: 'Пользователь не найден' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1621] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#2AABEE] to-[#229ED9] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Icon name="Send" size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tunzok</h1>
            <p className="text-slate-500">
              {mode === 'login' ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2AABEE] to-[#229ED9] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg hover:opacity-90 transition-opacity">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <Icon name="Camera" size={32} className="text-white" />
                        )}
                      </div>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#2AABEE] text-white text-xs px-3 py-1 rounded-full shadow">
                      Фото
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">
                      Имя
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={`mt-1 ${errors.firstName ? 'border-red-500' : 'border-slate-200'}`}
                      placeholder="Иван"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">
                      Фамилия
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={`mt-1 ${errors.lastName ? 'border-red-500' : 'border-slate-200'}`}
                      placeholder="Иванов"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="username" className="text-slate-700 font-medium">
                Имя пользователя
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`mt-1 ${errors.username ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="username"
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <Label htmlFor="bio" className="text-slate-700 font-medium">
                  О себе
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-1 border-slate-200 resize-none"
                  placeholder="Расскажите о себе..."
                  rows={3}
                />
              </div>
            )}

            <div>
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`mt-1 ${errors.password ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                  Подтвердите пароль
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white font-medium py-6 text-base shadow-lg"
            >
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrors({});
              }}
              className="text-[#2AABEE] hover:underline text-sm font-medium"
            >
              {mode === 'login' ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
