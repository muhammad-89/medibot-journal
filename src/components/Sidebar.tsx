import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquarePlus, Search, Trash2 } from "lucide-react";

interface SidebarProps {
  onNewChat: () => void;
  currentChat: string | null;
  setCurrentChat: (chatId: string | null) => void;
}

export const Sidebar = ({ onNewChat, currentChat, setCurrentChat }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock chat history - replace with real data
  const chatHistory = [
    { id: "1", name: "Chest X-Ray Analysis", date: "2024-03-20" },
    { id: "2", name: "Blood Test Results", date: "2024-03-19" },
    { id: "3", name: "MRI Consultation", date: "2024-03-18" },
  ];

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
                    // Handle delete
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