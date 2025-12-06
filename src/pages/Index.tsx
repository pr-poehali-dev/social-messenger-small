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
import CreateGroup from '@/components/CreateGroup';
import AdminPanel from '@/components/AdminPanel';
import ProfileView from '@/components/ProfileView';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  type?: 'chat' | 'group' | 'channel';
  description?: string;
  isBot?: boolean;
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
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [groups, setGroups] = useState<Chat[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('tunzok_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedGroups = localStorage.getItem('tunzok_groups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const hasGreeted = localStorage.getItem(`maybot_greeted_${user.username}`);
      if (!hasGreeted) {
        setSelectedChat({
          id: 0,
          name: 'МайБот',
          lastMessage: 'Добро пожаловать!',
          time: 'Сейчас',
          unread: 0,
          avatar: '🤖',
          type: 'chat',
          isBot: true,
        });
      }
    }
  }, [user]);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateUser = (userData: UserData) => {
    setUser(userData);
  };

  const handleCreateGroup = (group: {
    name: string;
    description: string;
    type: 'group' | 'channel';
    avatar: string;
  }) => {
    const newGroup: Chat = {
      id: Date.now(),
      name: group.name,
      lastMessage: group.description || 'Группа создана',
      time: 'Сейчас',
      unread: 0,
      avatar: group.name.substring(0, 2).toUpperCase(),
      type: group.type,
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('tunzok_groups', JSON.stringify(updatedGroups));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const maybotChat: Chat = {
    id: 0,
    name: 'МайБот',
    lastMessage: 'Я ваш помощник в мессенджере',
    time: '',
    unread: 0,
    avatar: '🤖',
    type: 'chat',
    description: 'Официальный бот Tunzok. Помогаю новым пользователям и отвечаю на вопросы.',
    isBot: true,
  };

  const chats: Chat[] = [
    maybotChat,
    { id: 1, name: 'Анна Смирнова', lastMessage: 'Встречаемся завтра?', time: '14:32', unread: 2, avatar: 'АС', type: 'chat' },
    { id: 2, name: 'Команда разработки', lastMessage: 'Отправил новые макеты', time: '12:15', unread: 0, avatar: 'КР', type: 'chat' },
    { id: 3, name: 'Мама', lastMessage: 'Не забудь позвонить!', time: 'Вчера', unread: 1, avatar: 'М', type: 'chat' },
    { id: 4, name: 'Игорь Петров', lastMessage: 'Спасибо за помощь', time: 'Вчера', unread: 0, avatar: 'ИП', type: 'chat' },
    ...groups,
  ];

  const isAdmin = user.username === 'Glushkov';

  if (selectedChat) {
    return (
      <ChatWindow
        chatName={selectedChat.name}
        chatAvatar={selectedChat.avatar}
        chatId={selectedChat.id}
        chatType={selectedChat.type}
        onClose={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1621]">
      {showCreateGroup && (
        <CreateGroup
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}

      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Send" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Tunzok</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                onClick={() => setShowAdminPanel(true)}
                className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30"
              >
                <Icon name="Shield" size={18} className="mr-2" />
                Админ-панель
              </Button>
            )}
            <Button
              onClick={() => setShowCreateGroup(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Создать
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-[#1e1e2e] border-0 shadow-sm mb-6 p-1 h-auto">
            <TabsTrigger value="chats" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-slate-400">
              <Icon name="MessageSquare" size={18} className="mr-2" />
              Чаты
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-slate-400">
              <Icon name="Users" size={18} className="mr-2" />
              Контакты
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-slate-400">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="animate-fade-in">
            <div className="mb-4">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input 
                  placeholder="Поиск чатов..." 
                  className="pl-10 bg-[#1e1e2e] border-[#2e2e3e] text-white placeholder:text-slate-500"
                />
              </div>
            </div>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {chats.map((chat) => (
                  <Card
                    key={chat.id}
                    className="p-4 hover:bg-[#2e2e3e] transition-all cursor-pointer bg-[#1e1e2e] border-[#2e2e3e]"
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className={chat.isBot ? 'bg-blue-600/20 text-blue-400 font-semibold text-xl' : 'bg-purple-600/20 text-purple-400 font-semibold'}>
                          {chat.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white truncate">{chat.name}</h3>
                            {chat.isBot && (
                              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs">
                                <Icon name="Bot" size={10} className="mr-1" />
                                Бот
                              </Badge>
                            )}
                            {chat.type === 'group' && (
                              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-xs">
                                <Icon name="Users" size={10} className="mr-1" />
                                Группа
                              </Badge>
                            )}
                            {chat.type === 'channel' && (
                              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs">
                                <Icon name="Radio" size={10} className="mr-1" />
                                Канал
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">{chat.time}</span>
                        </div>
                        <p className="text-sm text-slate-400 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <Badge className="bg-purple-600 text-white border-0">
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
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input 
                  placeholder="Поиск контактов..." 
                  className="pl-10 bg-[#1e1e2e] border-[#2e2e3e] text-white placeholder:text-slate-500"
                />
              </div>
            </div>
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chats.filter(c => c.type === 'chat' && !c.isBot).map((contact) => (
                  <Card key={contact.id} className="p-6 text-center hover:bg-[#2e2e3e] transition-all cursor-pointer bg-[#1e1e2e] border-[#2e2e3e]" onClick={() => setSelectedChat(contact)}>
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarFallback className="bg-purple-600/20 text-purple-400 text-xl font-semibold">
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-white mb-2">{contact.name}</h3>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white border-0"
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

          <TabsContent value="profile" className="animate-fade-in">
            <ProfileView
              user={user}
              onUpdate={handleUpdateUser}
              onLogout={handleLogout}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}