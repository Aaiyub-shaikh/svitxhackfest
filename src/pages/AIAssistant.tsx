import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Mic, MicOff, Volume2, Languages, MessageCircle, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: number;
  type: 'user' | 'assistant';
  message: string;
  timestamp: Date;
  language?: string;
}

const AIAssistant = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'assistant',
      message: 'Hello! I\'m your AI farming assistant. I can help you with crop advice, weather information, disease identification, and farming best practices. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी (Hindi)' },
    { value: 'punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' },
    { value: 'marathi', label: 'मराठी (Marathi)' },
    { value: 'tamil', label: 'தமிழ் (Tamil)' },
    { value: 'telugu', label: 'తెలుగు (Telugu)' },
    { value: 'bengali', label: 'বাংলা (Bengali)' }
  ];

  const langToBCP47: Record<string, string> = {
    english: 'en-IN',
    hindi: 'hi-IN',
    punjabi: 'pa-IN',
    gujarati: 'gu-IN',
    marathi: 'mr-IN',
    tamil: 'ta-IN',
    telugu: 'te-IN',
    bengali: 'bn-IN',
  };

  const quickActions = [
    { label: 'Weather Forecast', action: 'What\'s the weather forecast for my area?' },
    { label: 'Crop Disease Help', action: 'I think my crops have a disease. Can you help identify it?' },
    { label: 'Irrigation Schedule', action: 'When should I water my crops?' },
    { label: 'Fertilizer Advice', action: 'What fertilizer should I use for my crops?' },
    { label: 'Market Prices', action: 'What are the current market prices for my crops?' },
    { label: 'Pest Control', action: 'How can I control pests in my field?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load available voices for TTS
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      message: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        type: 'assistant',
        message: generateAIResponse(inputMessage),
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('weather')) {
      return 'Based on current meteorological data, expect partly cloudy conditions with 28°C temperature and 15mm rainfall expected in the next 3 days. This is favorable for most crops. I recommend monitoring soil moisture levels.';
    } else if (input.includes('disease') || input.includes('pest')) {
      return 'For accurate disease identification, I recommend uploading crop images in the Disease Detection section. Common signs to look for include leaf discoloration, wilting, or unusual spots. Meanwhile, ensure proper spacing between plants and avoid over-watering.';
    } else if (input.includes('irrigation') || input.includes('water')) {
      return 'Based on current soil moisture (45%) and weather conditions, I recommend irrigating in 2-3 days. For your crop type, early morning irrigation (5-7 AM) is most effective. Use drip irrigation to conserve water.';
    } else if (input.includes('fertilizer')) {
      return 'For optimal growth, I recommend applying NPK fertilizer (10:26:26) at 150kg per hectare. Apply during early morning or late evening. Soil testing shows nitrogen levels are adequate, but phosphorus could be increased.';
    } else if (input.includes('price') || input.includes('market')) {
      return 'Current market rates: Rice ₹22,000/ton, Wheat ₹25,000/ton, Cotton ₹48,000/ton. Prices have increased 5% this week. Consider selling within the next 2 weeks for better returns.';
    } else {
      return 'I understand your farming concern. For the most accurate advice, could you provide more details about your crop type, location, and specific issue? I can then give you targeted recommendations based on current agricultural best practices.';
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  const toggleListening = () => {
    if (!isListening) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({ title: 'Voice not supported', description: 'Your browser does not support Speech Recognition', variant: 'destructive' });
        return;
      }
      const recog = new SpeechRecognition();
      recognitionRef.current = recog;
      recog.lang = langToBCP47[selectedLanguage] || 'en-IN';
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      recog.onresult = (e: any) => {
        const transcript = e.results?.[0]?.[0]?.transcript || '';
        setInputMessage(transcript);
      };
      recog.onend = () => setIsListening(false);
      recog.onerror = () => setIsListening(false);
      try {
        recog.start();
        setIsListening(true);
        toast({ title: 'Voice Input Active', description: 'Speak now...' });
      } catch (err) {
        console.error(err);
        toast({ title: 'Failed to start voice input', variant: 'destructive' });
        setIsListening(false);
      }
    } else {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
      setIsListening(false);
      toast({ title: 'Voice Input Stopped', description: 'Stopped listening' });
    }
  };

  const speakMessage = (message: string) => {
    if (!('speechSynthesis' in window)) {
      toast({ title: 'TTS not supported', description: 'Your browser does not support Text-to-Speech', variant: 'destructive' });
      return;
    }
    const utter = new SpeechSynthesisUtterance(message);
    const lang = langToBCP47[selectedLanguage] || 'en-IN';
    utter.lang = lang;
    // Prefer a voice matching the selected language
    const match = availableVoices.find(v => v.lang?.toLowerCase().startsWith(lang.toLowerCase()));
    if (match) utter.voice = match;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-growth rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          AI Farming Assistant
        </h1>
        <p className="text-muted-foreground text-lg">
          Get expert farming advice with voice support in multiple Indian languages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="shadow-card h-[600px] flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Chat with AI Assistant
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-gradient-growth text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.type === 'assistant' && (
                          <Bot className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                            {message.type === 'assistant' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => speakMessage(message.message)}
                                className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                              >
                                <Volume2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                      <Bot className="w-5 h-5 text-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about farming..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleListening}
                    className={`absolute right-1 top-1 h-8 w-8 p-0 ${
                      isListening ? 'text-destructive' : 'text-muted-foreground'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-growth text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <Leaf className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    AI-Powered
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    Voice Input
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    Text-to-Speech
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Languages className="w-3 h-3" />
                    8 Languages
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Be specific about your crop type and location for better advice</p>
              <p>• Upload images for disease identification</p>
              <p>• Ask about weather, irrigation, fertilizers, or market prices</p>
              <p>• Use voice input for hands-free interaction</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;