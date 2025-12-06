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
  time: string;
  reactions?: string[];
}

interface ChatWindowProps {
  chatName: string;
  chatAvatar: string;
  onClose: () => void;
}

export default function ChatWindow({ chatName, chatAvatar, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', sender: 'other', time: '14:30' },
    { id: 2, text: 'Привет! Всё отлично, спасибо!', sender: 'me', time: '14:31' },
    { id: 3, text: 'Встречаемся завтра?', sender: 'other', time: '14:32', reactions: ['👍', '❤️'] },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const stickers = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '😎', '🤔', '👏', '🎂', '🎁', '⭐'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        time: timeStr,
      }]);
      setNewMessage('');
      setShowStickers(false);

      setTimeout(() => {
        const responses = [
          'Отлично!',
          'Согласен',
          'Понял тебя',
          'Хорошая идея!',
          'Давай так и сделаем',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: randomResponse,
          sender: 'other',
          time: `${now.getHours()}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
        }]);
      }, 1500);
    }
  };

  const handleSendSticker = (sticker: string) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setMessages([...messages, {
      id: messages.length + 1,
      text: sticker,
      sender: 'me',
      time: timeStr,
    }]);
    setShowStickers(false);
  };

  const handleReaction = (messageId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        if (reactions.includes(emoji)) {
          return { ...msg, reactions: reactions.filter(r => r !== emoji) };
        } else {
          return { ...msg, reactions: [...reactions, emoji] };
        }
      }
      return msg;
    }));
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="bg-[#2AABEE] text-white p-4 flex items-center gap-3 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <Icon name="ArrowLeft" size={24} />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-white/30 text-white font-semibold">
            {chatAvatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold">{chatName}</h2>
          <p className="text-xs text-white/80">в сети</p>
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
                  <AvatarFallback className="bg-[#2AABEE] text-white text-xs">
                    {chatAvatar}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex flex-col ${message.sender === 'me' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <Card
                  className={`p-3 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-[#2AABEE] text-white border-0'
                      : 'bg-[#f0f0f0] border-0 text-slate-900'
                  } ${message.text.length <= 3 ? 'text-4xl p-2' : ''}`}
                >
                  <p className={message.text.length <= 3 ? 'text-center' : ''}>{message.text}</p>
                </Card>
                
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className={`text-xs ${message.sender === 'me' ? 'text-slate-500' : 'text-slate-500'}`}>
                    {message.time}
                  </span>
                  
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1">
                      {message.reactions.map((reaction, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-slate-100 rounded-full px-2 py-0.5 cursor-pointer hover:bg-slate-200 transition-colors"
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
                    <Icon name="Heart" size={14} className="text-slate-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {showStickers && (
        <div className="p-4 border-t border-slate-200 bg-white animate-fade-in">
          <div className="grid grid-cols-6 gap-2 max-w-4xl mx-auto">
            {stickers.map((sticker, idx) => (
              <button
                key={idx}
                onClick={() => handleSendSticker(sticker)}
                className="text-4xl p-3 hover:bg-slate-100 rounded-lg transition-colors hover-scale"
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowStickers(!showStickers)}
            className={`flex-shrink-0 ${showStickers ? 'bg-slate-100' : ''}`}
          >
            <Icon name="Smile" size={20} />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Сообщение..."
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Icon name="Paperclip" size={18} className="text-slate-400" />
            </Button>
          </div>

          <Button
            size="icon"
            onClick={handleSendMessage}
            className="bg-[#2AABEE] hover:bg-[#229ED9] text-white border-0 flex-shrink-0"
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}