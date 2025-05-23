import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Send, Paperclip, Bot, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  attachments?: { type: string; url: string; name: string }[];
}

interface ChatContainerProps {
  chatId: string;
}

export const ChatContainer = ({ chatId }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const attachmentUrls = await Promise.all(
      attachments.map(async (file) => {
        // In a real app, you would upload the file to a server here
        // For now, we'll create a temporary URL
        const url = URL.createObjectURL(file);
        return {
          type: file.type.startsWith("image/") ? "image" : "file",
          url,
          name: file.name,
        };
      })
    );

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      attachments: attachmentUrls,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    try {
      // Mock API call - replace with actual Gemini API integration
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve("This is a mock response from the AI. In production, this would be replaced with actual Gemini API integration.");
        }, 1000);
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response as string,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments((prev) => [...prev, ...newFiles]);
      toast({
        title: "Files attached",
        description: `${newFiles.length} file(s) attached successfully.`,
      });
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.role === "user" ? "message-user" : "message-bot"
              }`}
            >
              <div className="h-8 w-8 rounded-full glass flex items-center justify-center">
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </div>
                <div className="mt-1">{message.content}</div>
                {message.attachments?.map((attachment, index) => (
                  <div key={index} className="mt-2">
                    {attachment.type === "image" ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="max-w-xs rounded-lg"
                      />
                    ) : (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Paperclip className="h-4 w-4" />
                        {attachment.name}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 glass">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-secondary/50 rounded-lg px-2 py-1"
              >
                <span className="text-sm truncate max-w-[200px]">
                  {file.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleFileUpload}
          />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            className="w-24"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};