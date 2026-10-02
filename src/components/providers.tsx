import SocketContextProvider from "@/contexts/socketio";
import Preloader from "./preloader";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/toaster";
import { TooltipProvider } from "./ui/tooltip";
import { ChatbotProvider } from "@/lib/chatbot-context";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <Preloader>
        <SocketContextProvider>
          <TooltipProvider>
            <ChatbotProvider>
              {children}
            </ChatbotProvider>
          </TooltipProvider>
          <Toaster />
        </SocketContextProvider>
      </Preloader>
    </ThemeProvider>
  );
};
