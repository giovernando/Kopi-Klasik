import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DriverContactProps {
  deliveryMethod: 'grab' | 'gojek';
  driverName?: string;
}

export function DriverContact({ deliveryMethod, driverName = 'Driver' }: DriverContactProps) {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isDriver: boolean }[]>([
    { text: 'Hi! I\'m on my way to deliver your order.', isDriver: true },
  ]);
  const { toast } = useToast();

  const handleCall = () => {
    toast({
      title: 'Calling driver...',
      description: `Connecting to ${driverName}`,
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, isDriver: false }]);
    setMessage('');

    // Simulate driver response
    setTimeout(() => {
      const responses = [
        'Got it! I\'ll be there soon.',
        'No problem, see you in a few minutes!',
        'Understood, thank you!',
      ];
      setMessages((prev) => [
        ...prev,
        { text: responses[Math.floor(Math.random() * responses.length)], isDriver: true },
      ]);
    }, 1500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <h3 className="font-display font-semibold mb-4">Contact Driver</h3>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            deliveryMethod === 'grab' ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`}>
            <span className={`text-lg font-bold ${
              deliveryMethod === 'grab' ? 'text-emerald-500' : 'text-red-500'
            }`}>
              {deliveryMethod === 'grab' ? 'G' : 'GJ'}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium">{driverName}</p>
            <p className="text-sm text-muted-foreground capitalize">{deliveryMethod} Driver</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleCall}
            >
              <Phone className="h-5 w-5 text-accent" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setShowChat(true)}
            >
              <MessageCircle className="h-5 w-5 text-accent" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Chat Dialog */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-md h-[70vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b border-border">
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                deliveryMethod === 'grab' ? 'bg-emerald-500/20' : 'bg-red-500/20'
              }`}>
                <span className={`text-sm font-bold ${
                  deliveryMethod === 'grab' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {deliveryMethod === 'grab' ? 'G' : 'GJ'}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{driverName}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.isDriver ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.isDriver
                      ? 'bg-secondary text-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button variant="accent" size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
