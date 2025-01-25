import { useState, useImperativeHandle, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquarePlus, Search, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Chat {
  id: string;
  name: string;
  date: string;
}

interface SidebarProps {
  onNewChat: () => void;
  currentChat: string | null;
  setCurrentChat: (chatId: string | null) => void;
  addNewChatRef: React.MutableRefObject<((chatName: string) => void) | null>;
}

export const Sidebar = ({ 
  onNewChat, 
  currentChat, 
  setCurrentChat,
  addNewChatRef 
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const { toast } = useToast();

  const addNewChat = (chatName: string) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name: chatName,
      date: new Date().toISOString().split('T')[0],
    };
    
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChat(newChat.id);
    
    toast({
      title: "Chat created",
      description: `New chat "${chatName}" has been created.`,
    });
  };

  // Expose addNewChat function through the ref
  useEffect(() => {
    addNewChatRef.current = addNewChat;
    return () => {
      addNewChatRef.current = null;
    };
  }, [addNewChatRef]);

  const deleteChat = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChat === chatId) {
      setCurrentChat(null);
    }
    
    toast({
      title: "Chat deleted",
      description: "The chat has been deleted successfully.",
    });
  };

  const filteredChats = chatHistory.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r glass flex flex-col">
      <div className="p-4 space-y-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start space-x-2"
          variant="outline"
        >
          <MessageSquarePlus size={20} />
          <span>New Chat</span>
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setCurrentChat(chat.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors duration-200 group hover:bg-secondary/80 ${
                currentChat === chat.id ? "bg-secondary" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{chat.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">{chat.date}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};