import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do I track my order?',
    answer: 'You can track your order by going to Orders from the Profile page or bottom navigation. Click on any order to see real-time status updates.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept E-Wallet (GoPay, OVO, DANA), Bank Transfer, and Cash on Delivery for pickup orders.',
  },
  {
    question: 'How can I cancel my order?',
    answer: 'You can cancel your order within 5 minutes of placing it by going to Order Details and clicking Cancel Order. After that, please contact our support team.',
  },
  {
    question: 'What are your delivery areas?',
    answer: 'We deliver within a 10km radius of our store locations through Grab and Gojek delivery partners.',
  },
  {
    question: 'How do I make a reservation?',
    answer: 'Go to the Reserve tab from the bottom navigation, select your preferred date, time, and number of guests, then confirm your reservation.',
  },
  {
    question: 'Can I modify my order after placing it?',
    answer: 'Order modifications are only possible before the order is confirmed. Please contact our support team as soon as possible if you need to make changes.',
  },
];

export default function HelpSupportPage() {
  const { toast } = useToast();

  const handleContactMethod = (method: string) => {
    toast({
      title: `Opening ${method}`,
      description: `Connecting you to our support via ${method}...`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 px-4 h-14">
          <Link to="/profile" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display font-bold text-lg">Help & Support</h1>
        </div>
      </header>

      <main className="p-4 pb-24 space-y-6">
        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Contact Us</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleContactMethod('Chat')}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
            >
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm font-medium">Live Chat</span>
            </button>
            <button
              onClick={() => handleContactMethod('Phone')}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="text-sm font-medium">Call Us</span>
            </button>
            <button
              onClick={() => handleContactMethod('Email')}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Email</span>
            </button>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Frequently Asked Questions</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-border last:border-0">
                  <AccordionTrigger className="px-4 py-3 text-left hover:no-underline">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-sm">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pl-12">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Resources</h2>
          <div className="space-y-2">
            <button className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:bg-secondary transition-colors">
              <span className="flex-1 text-left font-medium">Terms of Service</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:bg-secondary transition-colors">
              <span className="flex-1 text-left font-medium">Privacy Policy</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:bg-secondary transition-colors">
              <span className="flex-1 text-left font-medium">Cookie Policy</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
