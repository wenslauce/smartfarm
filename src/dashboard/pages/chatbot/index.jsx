'use client';

import { useState, useRef, useEffect } from 'react';
import { sendMessageToGroq } from '@/lib/groq';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

const welcomeMessage = {
  role: 'assistant',
  content: `# 👋 Welcome to AgriSmart AI Assistant!

I'm here to help you with agricultural questions and advice. Feel free to ask about:
- Crop management and cultivation
- Sustainable farming practices
- Pest control and disease management
- Soil health and fertilization
- Weather impact on farming
- Modern farming techniques`
};

export default function Chatbot() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollAreaRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await sendMessageToGroq([...messages, userMessage]);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      setError(err.message);
      // Remove the user's message if we couldn't get a response
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([welcomeMessage]);
    setInput('');
    setError(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
      <Card className="flex-1 overflow-hidden flex flex-col bg-gradient-to-br from-green-50/90 to-white/90 backdrop-blur-xl border border-green-100/60">
        {/* Header */}
        <div className="p-4 border-b border-green-100/60 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Bot className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">AgriSmart AI Assistant</h2>
              <p className="text-sm text-gray-500">Powered by Groq</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2 text-green-700 hover:text-green-800"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Chat
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1">
          <div className="p-4 space-y-4">
            {error && (
              <div className="flex items-center justify-center p-3 text-red-500 bg-red-50 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-red-500" />
                  </div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex gap-3 max-w-[80%]",
                  message.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === 'user' ? "bg-primary/10" : "bg-green-100"
                  )}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-primary" />
                    ) : (
                      <Bot className="w-5 h-5 text-green-700" />
                    )}
                  </div>
                  <div className={cn(
                    "rounded-lg px-4 py-2",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-white shadow-sm border border-green-100/60"
                  )}>
                    <div className={cn(
                      "prose max-w-none",
                      message.role === 'user' ? "prose-invert" : "prose-green"
                    )}>
                      <ReactMarkdown components={{
                        // Add custom components for markdown elements
                        p: ({ children }) => <p className="m-0">{children}</p>,
                        ul: ({ children }) => <ul className="my-2">{children}</ul>,
                        ol: ({ children }) => <ol className="my-2">{children}</ol>,
                        li: ({ children }) => <li className="my-0">{children}</li>,
                        h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 mt-1">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base font-medium mb-1 mt-1">{children}</h3>,
                        code: ({ children }) => <code className="bg-slate-100 rounded px-1 py-0.5">{children}</code>,
                        pre: ({ children }) => <pre className="bg-slate-100 rounded p-2 my-2 overflow-x-auto">{children}</pre>,
                      }}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-green-700" />
                </div>
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-green-100/60">
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-green-100/60 bg-white/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about agriculture..."
              disabled={isLoading}
              className="flex-1 bg-white/80"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 