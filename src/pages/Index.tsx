import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/Sidebar";
import { ChatContainer } from "@/components/ChatContainer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NewChatDialog } from "@/components/NewChatDialog";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const { toast } = useToast();

  // Create a ref to store the addNewChat function from Sidebar
  const addNewChatRef = React.useRef<((chatName: string) => void) | null>(null);

  const handleNewChat = (chatName: string) => {
    if (chatName.trim()) {
      // Call the addNewChat function from Sidebar through the ref
      addNewChatRef.current?.(chatName);
      setShowNewChatDialog(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        onNewChat={() => setShowNewChatDialog(true)}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        addNewChatRef={addNewChatRef}
      />
      
      <main className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 glass">
          <h1 className="text-xl font-semibold">AI Medical Assistant</h1>
          <ThemeToggle />
        </header>
        
        {currentChat ? (
          <ChatContainer chatId={currentChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Welcome to AI Medical Assistant</h2>
              <p className="text-muted-foreground">Start a new chat or select an existing one</p>
              <Button onClick={() => setShowNewChatDialog(true)}>
                Start New Chat
              </Button>
            </div>
          </div>
        )}
      </main>

      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onSubmit={handleNewChat}
      />
    </div>
  );
};

export default Index;