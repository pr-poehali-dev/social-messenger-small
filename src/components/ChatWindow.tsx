import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  senderName?: string;
  time: string;
  reactions?: string[];
}

interface ChatWindowProps {
  chatName: string;
  chatAvatar: string;
  chatId: number;
  chatType?: 'chat' | 'group' | 'channel';
  onClose: () => void;
}

export default function ChatWindow({ chatName, chatAvatar, chatId, chatType = 'chat', onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const stickers = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '😎', '🤔', '👏', '🎂', '🎁', '⭐'];

  useEffect(() => {
    const savedMessages = localStorage.getItem(`tunzok_messages_${chatId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const currentUser = localStorage.getItem('tunzok_user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const hasGreeted = localStorage.getItem(`maybot_greeted_${user.username}`);
        
        if (!hasGreeted && chatId === 0) {
          const now = new Date();
          const greetMessage: Message = {
            id: 1,
            text: `Добро пожаловать в наш мессенджер, ${user.firstName}! Если появятся вопросы, обращайтесь ко мне.`,
            sender: 'other',
            senderName: 'МайБот',
            time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
          };
          setMessages([greetMessage]);
          localStorage.setItem(`tunzok_messages_${chatId}`, JSON.stringify([greetMessage]));
          localStorage.setItem(`maybot_greeted_${user.username}`, 'true');
        }
      }
    }
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const saveMessages = (msgs: Message[]) => {
    localStorage.setItem(`tunzok_messages_${chatId}`, JSON.stringify(msgs));
    setMessages(msgs);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentUser = localStorage.getItem('tunzok_user');
      const user = currentUser ? JSON.parse(currentUser) : null;
      
      const newMsg: Message = {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        senderName: user ? `${user.firstName} ${user.lastName}` : 'Вы',
        time: timeStr,
      };
      
      const updatedMessages = [...messages, newMsg];
      saveMessages(updatedMessages);
      setNewMessage('');
      setShowStickers(false);

      if (chatType !== 'channel' && chatId === 0) {
        setTimeout(() => {
          const responses = [
            'Я всегда на связи! Чем могу помочь?',
            'Хорошо, отвечу на любые вопросы.',
            'Понял вас! Что еще вас интересует?',
            'Рад помочь! Задавайте вопросы.',
            'С удовольствием помогу!',
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          const botReply: Message = {
            id: Date.now() + 1,
            text: randomResponse,
            sender: 'other',
            senderName: 'МайБот',
            time: `${now.getHours()}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
          };
          saveMessages([...updatedMessages, botReply]);
        }, 1500);
      }
    }
  };

  const handleSendSticker = (sticker: string) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentUser = localStorage.getItem('tunzok_user');
    const user = currentUser ? JSON.parse(currentUser) : null;
    
    const stickerMsg: Message = {
      id: Date.now(),
      text: sticker,
      sender: 'me',
      senderName: user ? `${user.firstName} ${user.lastName}` : 'Вы',
      time: timeStr,
    };
    
    saveMessages([...messages, stickerMsg]);
    setShowStickers(false);
  };

  const handleReaction = (messageId: number, emoji: string) => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        if (reactions.includes(emoji)) {
          return { ...msg, reactions: reactions.filter(r => r !== emoji) };
        } else {
          return { ...msg, reactions: [...reactions, emoji] };
        }
      }
      return msg;
    });
    saveMessages(updatedMessages);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0e1621] to-[#0a0f1a] z-50 flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none"></div>
      
      <div className="glass-effect text-white p-5 flex items-center gap-3 shadow-2xl border-b border-white/10 relative z-10 backdrop-blur-2xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10 transition-all hover:scale-110 rounded-xl"
        >
          <Icon name="ArrowLeft" size={24} />
        </Button>
        <Avatar className="w-12 h-12 ring-2 ring-purple-500/20">
          <AvatarFallback className="bg-gradient-to-br from-purple-600/30 to-purple-700/30 text-purple-400 font-semibold text-lg">
            {chatAvatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{chatName}</h2>
          <p className="text-xs text-purple-400 font-medium">
            {chatType === 'group' ? 'группа' : chatType === 'channel' ? 'канал' : 'в сети'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-purple-400 hover:bg-purple-500/20 transition-all hover:scale-110 rounded-xl"
        >
          <Icon name="Phone" size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-purple-400 hover:bg-purple-500/20 transition-all hover:scale-110 rounded-xl"
        >
          <Icon name="Video" size={20} />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4 relative z-10" ref={scrollRef}>
        <div className="space-y-4 max-w-4xl mx-auto animate-fade-in">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} group`}
            >
              {message.sender === 'other' && (
                <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-purple-500/20">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600/30 to-purple-700/30 text-purple-400 text-xs font-semibold">
                    {message.senderName ? message.senderName.substring(0, 2).toUpperCase() : chatAvatar}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex flex-col ${message.sender === 'me' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                {message.sender === 'other' && message.senderName && (chatType === 'group' || chatType === 'channel') && (
                  <span className="text-xs text-purple-400 font-semibold mb-1 px-2">
                    {message.senderName}
                  </span>
                )}
                <Card
                  className={`p-4 rounded-2xl shadow-lg transition-all hover:shadow-xl ${
                    message.sender === 'me'
                      ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0 glow-effect'
                      : 'glass-effect border-white/10 text-white'
                  } ${message.text.length <= 3 ? 'text-4xl p-3' : ''}`}
                >
                  <p className={message.text.length <= 3 ? 'text-center' : ''}>{message.text}</p>
                </Card>
                
                <div className="flex items-center gap-2 mt-2 px-1">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {message.time}
                  </span>
                  
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1.5">
                      {message.reactions.map((reaction, idx) => (
                        <span
                          key={idx}
                          className="text-sm glass-effect rounded-full px-2.5 py-1 cursor-pointer hover:bg-white/20 transition-all hover:scale-110 shadow-md"
                          onClick={() => handleReaction(message.id, reaction)}
                        >
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-all h-7 w-7 hover:bg-white/10 rounded-full hover:scale-110"
                    onClick={() => handleReaction(message.id, '❤️')}
                  >
                    <Icon name="Heart" size={14} className="text-purple-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {showStickers && (
        <div className="p-6 border-t border-white/10 glass-effect animate-slide-up backdrop-blur-2xl relative z-10">
          <div className="grid grid-cols-6 gap-3 max-w-4xl mx-auto">
            {stickers.map((sticker, idx) => (
              <button
                key={idx}
                onClick={() => handleSendSticker(sticker)}
                className="text-4xl p-4 glass-effect hover:bg-white/20 rounded-2xl transition-all hover:scale-110 shadow-lg"
                style={{animationDelay: `${idx * 30}ms`}}
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-5 border-t border-white/10 glass-effect backdrop-blur-2xl relative z-10">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowStickers(!showStickers)}
            className={`flex-shrink-0 glass-effect hover:bg-white/20 text-slate-400 border-white/10 transition-all hover:scale-110 rounded-xl w-12 h-12 ${showStickers ? 'bg-purple-600/30 text-purple-400 glow-effect' : ''}`}
          >
            <Icon name="Smile" size={22} />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={chatType === 'channel' ? 'Написать пост...' : 'Сообщение...'}
              className="pr-12 py-6 rounded-2xl glass-effect border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-lg"
              disabled={chatType === 'channel'}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 hover:bg-white/10 rounded-xl transition-all hover:scale-110"
            >
              <Icon name="Paperclip" size={20} />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || chatType === 'channel'}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white flex-shrink-0 w-12 h-12 rounded-xl shadow-xl glow-effect transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Icon name="Send" size={22} />
          </Button>
        </div>
      </div>
    </div>
  );
}