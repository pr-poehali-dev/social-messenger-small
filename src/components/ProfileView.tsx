import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  avatar: string;
  password: string;
}

interface ProfileViewProps {
  user: UserData;
  onUpdate: (user: UserData) => void;
  onLogout: () => void;
}

export default function ProfileView({ user, onUpdate, onLogout }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [isVerified, setIsVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifiedUsers = JSON.parse(localStorage.getItem('tunzok_verified_users') || '[]');
    const verified = verifiedUsers.find((u: any) => u.username === user.username);
    setIsVerified(!!verified);
    setIsAdmin(user.username === 'Glushkov');
  }, [user.username]);

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

  const handleSave = () => {
    const updatedUser = { ...formData };
    localStorage.setItem('tunzok_user', JSON.stringify(updatedUser));
    onUpdate(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setAvatarPreview(user.avatar);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#1e1e2e] border-[#2e2e3e] overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-purple-600/20 to-blue-600/20 relative">
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              {isEditing ? (
                <label htmlFor="profile-avatar" className="cursor-pointer">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1e1e2e] bg-purple-600/20 flex items-center justify-center hover:opacity-90 transition-opacity">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="Camera" size={40} className="text-purple-400" />
                    )}
                  </div>
                  <input
                    id="profile-avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Icon name="Camera" size={16} className="text-white" />
                  </div>
                </label>
              ) : (
                <Avatar className="w-32 h-32 border-4 border-[#1e1e2e]">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-purple-600/20 text-purple-400 text-3xl font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 pb-6 px-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              {isEditing ? (
                <div className="space-y-3 mb-4">
                  <div className="flex gap-3">
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="bg-[#2e2e3e] border-[#3e3e4e] text-white"
                      placeholder="Имя"
                    />
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="bg-[#2e2e3e] border-[#3e3e4e] text-white"
                      placeholder="Фамилия"
                    />
                  </div>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-[#2e2e3e] border-[#3e3e4e] text-white"
                    placeholder="Имя пользователя"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">
                      {user.firstName} {user.lastName}
                    </h2>
                    {isVerified && (
                      <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                        <Icon name="BadgeCheck" size={14} className="mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-400">@{user.username}</p>
                </>
              )}
            </div>
            
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Icon name="Edit" size={18} className="mr-2" />
                Редактировать
              </Button>
            )}
          </div>

          {isAdmin && (
            <Card className="p-4 mb-4 bg-purple-600/10 border-purple-500/30">
              <div className="flex items-start gap-3">
                <Icon name="Shield" size={24} className="text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-purple-300 mb-1">
                    Аккаунт верифицирован и принадлежит администратору мессенджера
                  </p>
                  <p className="text-sm text-purple-400/70">
                    У вас есть полный доступ к административным функциям Tunzok
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">О себе</h3>
              {isEditing ? (
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-[#2e2e3e] border-[#3e3e4e] text-white resize-none"
                  placeholder="Расскажите о себе..."
                  rows={4}
                />
              ) : (
                <p className="text-white">
                  {user.bio || 'Информация не указана'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 bg-transparent border-[#3e3e4e] text-slate-300 hover:bg-[#2e2e3e] hover:text-white"
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Сохранить
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="bg-[#1e1e2e] border-[#2e2e3e] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Настройки аккаунта</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent border-[#3e3e4e] text-slate-300 hover:bg-[#2e2e3e] hover:text-white"
          >
            <Icon name="Lock" size={18} className="mr-3" />
            Изменить пароль
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent border-[#3e3e4e] text-slate-300 hover:bg-[#2e2e3e] hover:text-white"
          >
            <Icon name="Bell" size={18} className="mr-3" />
            Уведомления
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent border-[#3e3e4e] text-slate-300 hover:bg-[#2e2e3e] hover:text-white"
          >
            <Icon name="Shield" size={18} className="mr-3" />
            Приватность и безопасность
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <Icon name="LogOut" size={18} className="mr-3" />
            Выйти из аккаунта
          </Button>
        </div>
      </Card>
    </div>
  );
}
