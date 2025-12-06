import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface VerifiedUser {
  username: string;
  firstName: string;
  lastName: string;
  verifiedAt: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [username, setUsername] = useState('');
  const [verifiedUsers, setVerifiedUsers] = useState<VerifiedUser[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tunzok_verified_users');
    if (saved) {
      setVerifiedUsers(JSON.parse(saved));
    }
  }, []);

  const saveVerifiedUsers = (users: VerifiedUser[]) => {
    localStorage.setItem('tunzok_verified_users', JSON.stringify(users));
    setVerifiedUsers(users);
  };

  const handleVerify = () => {
    if (!username.trim()) return;

    const savedUser = localStorage.getItem('tunzok_user');
    if (!savedUser) {
      alert('Пользователь не найден');
      return;
    }

    const user = JSON.parse(savedUser);
    
    if (verifiedUsers.find(u => u.username === username)) {
      alert('Пользователь уже верифицирован');
      return;
    }

    const newVerified: VerifiedUser = {
      username: username,
      firstName: user.firstName || 'Пользователь',
      lastName: user.lastName || '',
      verifiedAt: new Date().toLocaleString('ru-RU'),
    };

    saveVerifiedUsers([...verifiedUsers, newVerified]);
    setUsername('');
  };

  const handleRemoveVerification = (username: string) => {
    saveVerifiedUsers(verifiedUsers.filter(u => u.username !== username));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-[#1e1e2e] border-[#2e2e3e] shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#2e2e3e]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Админ-панель</h2>
                <p className="text-sm text-slate-400">Управление верификацией</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-[#2e2e3e]"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="BadgeCheck" size={20} className="text-purple-400" />
              Выдать верификацию
            </h3>
            <div className="flex gap-3">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-[#2e2e3e] border-[#3e3e4e] text-white placeholder:text-slate-500"
                placeholder="Введите имя пользователя (например, Glushkov)"
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              />
              <Button
                onClick={handleVerify}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Icon name="Check" size={18} className="mr-2" />
                Выдать
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="Users" size={20} className="text-purple-400" />
              Верифицированные пользователи ({verifiedUsers.length})
            </h3>
            
            {verifiedUsers.length === 0 ? (
              <Card className="p-8 text-center bg-[#2e2e3e]/50 border-[#3e3e4e]">
                <Icon name="UserX" size={48} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Нет верифицированных пользователей</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {verifiedUsers.map((user) => (
                  <Card
                    key={user.username}
                    className="p-4 bg-[#2e2e3e] border-[#3e3e4e] hover:bg-[#2e2e3e]/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-purple-600/20 text-purple-400 font-semibold">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">
                              {user.firstName} {user.lastName}
                            </span>
                            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-xs">
                              <Icon name="BadgeCheck" size={12} className="mr-1" />
                              Verified
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">@{user.username}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Верифицирован: {user.verifiedAt}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVerification(user.username)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-[#2e2e3e]">
          <Button
            onClick={onClose}
            className="w-full bg-[#2e2e3e] hover:bg-[#3e3e4e] text-white"
          >
            Закрыть
          </Button>
        </div>
      </Card>
    </div>
  );
}
