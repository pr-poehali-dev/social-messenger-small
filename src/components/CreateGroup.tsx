import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CreateGroupProps {
  onClose: () => void;
  onCreate: (group: {
    name: string;
    description: string;
    type: 'group' | 'channel';
    avatar: string;
  }) => void;
}

export default function CreateGroup({ onClose, onCreate }: CreateGroupProps) {
  const [type, setType] = useState<'group' | 'channel'>('group');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (name.trim()) {
      onCreate({ name, description, type, avatar });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1e1e2e] border-[#2e2e3e] shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Создать {type === 'group' ? 'группу' : 'канал'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-[#2e2e3e]"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-300 mb-3 block">Тип</Label>
              <RadioGroup value={type} onValueChange={(v) => setType(v as 'group' | 'channel')}>
                <div className="flex gap-3">
                  <label className="flex-1">
                    <div
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        type === 'group'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-[#2e2e3e] bg-[#2e2e3e]/50 hover:border-purple-500/30'
                      }`}
                    >
                      <RadioGroupItem value="group" id="group" className="border-slate-500" />
                      <div>
                        <Icon name="Users" size={20} className="text-purple-400 mb-1" />
                        <div className="text-sm font-medium text-white">Группа</div>
                        <div className="text-xs text-slate-400">Общение участников</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex-1">
                    <div
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        type === 'channel'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-[#2e2e3e] bg-[#2e2e3e]/50 hover:border-purple-500/30'
                      }`}
                    >
                      <RadioGroupItem value="channel" id="channel" className="border-slate-500" />
                      <div>
                        <Icon name="Radio" size={20} className="text-purple-400 mb-1" />
                        <div className="text-sm font-medium text-white">Канал</div>
                        <div className="text-xs text-slate-400">Публикация постов</div>
                      </div>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <label htmlFor="group-avatar" className="cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center overflow-hidden border-2 border-purple-500/30 hover:border-purple-500 transition-colors">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="Camera" size={28} className="text-purple-400" />
                    )}
                  </div>
                </label>
                <input
                  id="group-avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="text-slate-300">
                Название
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-[#2e2e3e] border-[#3e3e4e] text-white placeholder:text-slate-500"
                placeholder={type === 'group' ? 'Название группы' : 'Название канала'}
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-300">
                Описание
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 bg-[#2e2e3e] border-[#3e3e4e] text-white placeholder:text-slate-500 resize-none"
                placeholder="Описание (необязательно)"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 bg-transparent border-[#3e3e4e] text-slate-300 hover:bg-[#2e2e3e] hover:text-white"
              >
                Отмена
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                Создать
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
