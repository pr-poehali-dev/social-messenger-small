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
    <div className="fixed inset-0 bg-[#0e1621] z-50 flex flex-col">
      <div className="bg-[#1e1e2e] text-white p-4 flex items-center gap-3 shadow-md border-b border-[#2e2e3e]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <Icon name="ArrowLeft" size={24} />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-purple-600/20 text-purple-400 font-semibold">
            {chatAvatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold">{chatName}</h2>
          <p className="text-xs text-slate-400">
            {chatType === 'group' ? 'группа' : chatType === 'channel' ? 'канал' : 'в сети'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <Icon name="Phone" size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <Icon name="Video" size={20} />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} group`}
            >
              {message.sender === 'other' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-purple-600/20 text-purple-400 text-xs">
                    {message.senderName ? message.senderName.substring(0, 2).toUpperCase() : chatAvatar}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex flex-col ${message.sender === 'me' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                {message.sender === 'other' && message.senderName && (chatType === 'group' || chatType === 'channel') && (
                  <span className="text-xs text-purple-400 font-medium mb-1 px-1">
                    {message.senderName}
                  </span>
                )}
                <Card
                  className={`p-3 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-purple-600 text-white border-0'
                      : 'bg-[#1e1e2e] border border-[#2e2e3e] text-white'
                  } ${message.text.length <= 3 ? 'text-4xl p-2' : ''}`}
                >
                  <p className={message.text.length <= 3 ? 'text-center' : ''}>{message.text}</p>
                </Card>
                
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-xs text-slate-500">
                    {message.time}
                  </span>
                  
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1">
                      {message.reactions.map((reaction, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-[#2e2e3e] rounded-full px-2 py-0.5 cursor-pointer hover:bg-[#3e3e4e] transition-colors"
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
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                    onClick={() => handleReaction(message.id, '❤️')}
                  >
                    <Icon name="Heart" size={14} className="text-slate-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {showStickers && (
        <div className="p-4 border-t border-[#2e2e3e] bg-[#1e1e2e] animate-fade-in">
          <div className="grid grid-cols-6 gap-2 max-w-4xl mx-auto">
            {stickers.map((sticker, idx) => (
              <button
                key={idx}
                onClick={() => handleSendSticker(sticker)}
                className="text-4xl p-3 hover:bg-[#2e2e3e] rounded-lg transition-colors hover-scale"
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-[#2e2e3e] bg-[#1e1e2e]">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowStickers(!showStickers)}
            className={`flex-shrink-0 bg-[#2e2e3e] hover:bg-[#3e3e4e] text-slate-400 ${showStickers ? 'bg-purple-600/20 text-purple-400' : ''}`}
          >
            <Icon name="Smile" size={20} />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={chatType === 'channel' ? 'Написать пост...' : 'Сообщение...'}
              className="pr-10 bg-[#2e2e3e] border-[#3e3e4e] text-white placeholder:text-slate-500"
              disabled={chatType === 'channel'}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
            >
              <Icon name="Paperclip" size={18} className="text-slate-500" />
            </Button>
          </div>

          <Button
            size="icon"
            onClick={handleSendMessage}
            className="bg-purple-600 hover:bg-purple-700 text-white border-0 flex-shrink-0"
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}