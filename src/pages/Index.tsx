import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatWindow from '@/components/ChatWindow';
import Auth from '@/components/Auth';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

interface StoreItem {
  id: number;
  name: string;
  price: number;
  emoji: string;
  category: 'sticker' | 'gift';
  exclusive: boolean;
}

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  avatar: string;
  password: string;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('chats');
  const [diamonds, setDiamonds] = useState(150);
  const [hasPlusSubscription, setHasPlusSubscription] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('tunzok_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const chats: Chat[] = [
    { id: 1, name: 'Анна Смирнова', lastMessage: 'Встречаемся завтра?', time: '14:32', unread: 2, avatar: 'АС' },
    { id: 2, name: 'Команда разработки', lastMessage: 'Отправил новые макеты', time: '12:15', unread: 0, avatar: 'КР' },
    { id: 3, name: 'Мама', lastMessage: 'Не забудь позвонить!', time: 'Вчера', unread: 1, avatar: 'М' },
    { id: 4, name: 'Игорь Петров', lastMessage: 'Спасибо за помощь', time: 'Вчера', unread: 0, avatar: 'ИП' },
  ];

  const storeItems: StoreItem[] = [
    { id: 1, name: 'Космический кот', price: 50, emoji: '🐱‍🚀', category: 'sticker', exclusive: true },
    { id: 2, name: 'Золотая звезда', price: 100, emoji: '⭐', category: 'gift', exclusive: true },
    { id: 3, name: 'Огненное сердце', price: 75, emoji: '❤️‍🔥', category: 'sticker', exclusive: false },
    { id: 4, name: 'Букет роз', price: 120, emoji: '💐', category: 'gift', exclusive: true },
    { id: 5, name: 'Радужный единорог', price: 80, emoji: '🦄', category: 'sticker', exclusive: false },
    { id: 6, name: 'Торт', price: 90, emoji: '🎂', category: 'gift', exclusive: false },
  ];

  const diamondPacks = [
    { amount: 100, price: 129, discount: false },
    { amount: 250, price: 279, discount: false },
    { amount: 500, price: 449, discount: true },
  ];

  if (selectedChat) {
    return (
      <ChatWindow
        chatName={selectedChat.name}
        chatAvatar={selectedChat.avatar}
        onClose={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2AABEE] rounded-xl flex items-center justify-center shadow-md">
              <Icon name="MessageCircle" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Tunzok</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-600"
              title="Выйти"
            >
              <Icon name="LogOut" size={20} />
            </Button>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full">
              <span className="text-2xl">💎</span>
              <span className="font-semibold text-slate-900">{diamonds}</span>
            </div>
            {hasPlusSubscription && (
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                MAY PLUS
              </Badge>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-white border-0 shadow-sm mb-6 p-1 h-auto">
            <TabsTrigger value="chats" className="flex-1 data-[state=active]:bg-[#2AABEE] data-[state=active]:text-white rounded-lg">
              <Icon name="MessageSquare" size={18} className="mr-2" />
              Чаты
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex-1 data-[state=active]:bg-[#2AABEE] data-[state=active]:text-white rounded-lg">
              <Icon name="Users" size={18} className="mr-2" />
              Контакты
            </TabsTrigger>
            <TabsTrigger value="store" className="flex-1 data-[state=active]:bg-[#2AABEE] data-[state=active]:text-white rounded-lg">
              <Icon name="Store" size={18} className="mr-2" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-[#2AABEE] data-[state=active]:text-white rounded-lg">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="animate-fade-in">
            <div className="mb-4">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Поиск чатов..." 
                  className="pl-10 bg-white border-slate-200"
                />
              </div>
            </div>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {chats.map((chat) => (
                  <Card
                    key={chat.id}
                    className="p-4 hover:shadow-md transition-all cursor-pointer hover-scale bg-white border-slate-200"
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                          {chat.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-slate-900 truncate">{chat.name}</h3>
                          <span className="text-xs text-slate-500">{chat.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contacts" className="animate-fade-in">
            <div className="mb-4">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Поиск контактов..." 
                  className="pl-10 bg-white border-slate-200"
                />
              </div>
            </div>
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chats.map((contact) => (
                  <Card key={contact.id} className="p-6 text-center hover:shadow-md transition-all hover-scale bg-white border-slate-200">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xl font-semibold">
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-slate-900 mb-2">{contact.name}</h3>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                      onClick={() => setSelectedChat(contact)}
                    >
                      <Icon name="MessageCircle" size={16} className="mr-2" />
                      Написать
                    </Button>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="store" className="animate-fade-in">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 bg-white/80 backdrop-blur-sm border border-slate-200">
                <TabsTrigger value="all">Всё</TabsTrigger>
                <TabsTrigger value="stickers">Стикеры</TabsTrigger>
                <TabsTrigger value="gifts">Подарки</TabsTrigger>
                <TabsTrigger value="diamonds">Алмазы</TabsTrigger>
                <TabsTrigger value="subscription">Подписка</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Icon name="Crown" size={24} className="text-yellow-500" />
                        Самые дорогие
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {storeItems
                          .sort((a, b) => b.price - a.price)
                          .slice(0, 4)
                          .map((item) => (
                            <Card key={item.id} className="p-4 text-center hover:shadow-lg transition-all hover-scale bg-white border-slate-200 relative overflow-hidden">
                              {item.exclusive && (
                                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                                  Эксклюзив
                                </Badge>
                              )}
                              <div className="text-6xl mb-3">{item.emoji}</div>
                              <h3 className="font-semibold text-slate-900 mb-2">{item.name}</h3>
                              <div className="flex items-center justify-center gap-1 mb-3">
                                <span className="text-xl">💎</span>
                                <span className="text-lg font-bold text-slate-900">{item.price}</span>
                              </div>
                              <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                                Купить
                              </Button>
                            </Card>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-4">Все товары</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {storeItems.map((item) => (
                          <Card key={item.id} className="p-4 text-center hover:shadow-lg transition-all hover-scale bg-white border-slate-200 relative overflow-hidden">
                            {item.exclusive && (
                              <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                                Эксклюзив
                              </Badge>
                            )}
                            <div className="text-6xl mb-3">{item.emoji}</div>
                            <h3 className="font-semibold text-slate-900 mb-2 text-sm">{item.name}</h3>
                            <div className="flex items-center justify-center gap-1 mb-3">
                              <span className="text-lg">💎</span>
                              <span className="font-bold text-slate-900">{item.price}</span>
                            </div>
                            <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                              Купить
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="stickers">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {storeItems
                    .filter((item) => item.category === 'sticker')
                    .map((item) => (
                      <Card key={item.id} className="p-4 text-center hover:shadow-lg transition-all hover-scale bg-white border-slate-200 relative overflow-hidden">
                        {item.exclusive && (
                          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                            Эксклюзив
                          </Badge>
                        )}
                        <div className="text-6xl mb-3">{item.emoji}</div>
                        <h3 className="font-semibold text-slate-900 mb-2">{item.name}</h3>
                        <div className="flex items-center justify-center gap-1 mb-3">
                          <span className="text-xl">💎</span>
                          <span className="text-lg font-bold text-slate-900">{item.price}</span>
                        </div>
                        <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                          Купить
                        </Button>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="gifts">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {storeItems
                    .filter((item) => item.category === 'gift')
                    .map((item) => (
                      <Card key={item.id} className="p-4 text-center hover:shadow-lg transition-all hover-scale bg-white border-slate-200 relative overflow-hidden">
                        {item.exclusive && (
                          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                            Эксклюзив
                          </Badge>
                        )}
                        <div className="text-6xl mb-3">{item.emoji}</div>
                        <h3 className="font-semibold text-slate-900 mb-2">{item.name}</h3>
                        <div className="flex items-center justify-center gap-1 mb-3">
                          <span className="text-xl">💎</span>
                          <span className="text-lg font-bold text-slate-900">{item.price}</span>
                        </div>
                        <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                          Подарить
                        </Button>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="diamonds">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Купить алмазы</h2>
                  <div className="grid gap-4">
                    {diamondPacks.map((pack, index) => (
                      <Card key={index} className="p-6 hover:shadow-lg transition-all hover-scale bg-white border-slate-200 relative overflow-hidden">
                        {pack.discount && (
                          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                            АКЦИЯ
                          </Badge>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-5xl">💎</div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900">{pack.amount} алмазов</h3>
                              <p className="text-slate-600">{pack.price} ₽</p>
                            </div>
                          </div>
                          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                            Купить
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="subscription">
                <div className="max-w-2xl mx-auto">
                  <Card className="p-8 bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0 shadow-xl">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                        <Icon name="Sparkles" size={40} className="text-white" />
                      </div>
                      <h2 className="text-3xl font-bold mb-2">MAY PLUS</h2>
                      <p className="text-white/90">Премиум возможности для твоего общения</p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={24} className="text-green-300 flex-shrink-0 mt-0.5" />
                        <p>Эксклюзивные стикеры каждый месяц</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={24} className="text-green-300 flex-shrink-0 mt-0.5" />
                        <p>Скидка 30% на все покупки в магазине</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={24} className="text-green-300 flex-shrink-0 mt-0.5" />
                        <p>Приоритетная поддержка 24/7</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={24} className="text-green-300 flex-shrink-0 mt-0.5" />
                        <p>Уникальный значок в профиле</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={24} className="text-green-300 flex-shrink-0 mt-0.5" />
                        <p>Расширенное хранилище файлов</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">720 ₽<span className="text-xl font-normal">/месяц</span></div>
                      <Button 
                        size="lg" 
                        className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold text-lg"
                        onClick={() => setHasPlusSubscription(true)}
                      >
                        Оформить подписку
                      </Button>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <Card className="p-8 bg-white border-slate-200 mb-6">
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-3xl font-semibold">
                      ВЫ
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Ваш профиль</h2>
                  <p className="text-slate-600">@username</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">💎</span>
                      <div>
                        <p className="text-sm text-slate-600">Баланс алмазов</p>
                        <p className="text-2xl font-bold text-slate-900">{diamonds}</p>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                      Пополнить
                    </Button>
                  </div>

                  {hasPlusSubscription && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white">
                      <div className="flex items-center gap-3">
                        <Icon name="Sparkles" size={32} />
                        <div>
                          <p className="text-sm text-white/90">Подписка активна</p>
                          <p className="text-xl font-bold">MAY PLUS</p>
                        </div>
                      </div>
                      <Button variant="outline" className="bg-white/20 border-white/40 text-white hover:bg-white/30">
                        Управление
                      </Button>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                      <Icon name="User" size={20} className="mr-3" />
                      Редактировать профиль
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                      <Icon name="Settings" size={20} className="mr-3" />
                      Настройки
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                      <Icon name="Bell" size={20} className="mr-3" />
                      Уведомления
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                      <Icon name="Shield" size={20} className="mr-3" />
                      Приватность
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                      <Icon name="HelpCircle" size={20} className="mr-3" />
                      Помощь
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}