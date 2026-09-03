import React, { useState } from "react";
import { MugenziProvider, useMugenzi } from "./context/MugenziContext";
import { TopAppBar } from "./components/common/TopAppBar";
import { BottomNavBar } from "./components/common/BottomNavBar";
import { NotificationDrawer } from "./components/common/NotificationDrawer";
import { JourneyView } from "./components/journey/JourneyView";
import { ChatView } from "./components/chat/ChatView";
import { LifeEventsView } from "./components/life_events/LifeEventsView";
import { DocumentValidatorView } from "./components/documents/DocumentValidatorView";
import { ProfileView } from "./components/profile/ProfileView";
import { KnowledgeBaseAdminView } from "./components/admin/KnowledgeBaseAdminView";
import { AuthModal } from "./components/auth/AuthModal";

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useMugenzi();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case "journey":
        return <JourneyView onOpenDocModal={() => setActiveTab("docs")} />;
      case "chat":
        return <ChatView />;
      case "life_events":
        return <LifeEventsView />;
      case "docs":
        return <DocumentValidatorView />;
      case "admin":
        return <KnowledgeBaseAdminView />;
      case "profile":
        return <ProfileView onOpenAuthModal={() => setIsAuthOpen(true)} />;
      default:
        return <JourneyView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col font-sans selection:bg-[#dae2ff] selection:text-[#00327d]">
      {/* Top App Bar with Rwanda Brand, Navigation & Notifications */}
      <TopAppBar onOpenNotifications={() => setIsNotifOpen(true)} />

      {/* Main View Container */}
      <main className="flex-1 w-full animate-in fade-in duration-200">
        {renderActiveView()}
      </main>

      {/* Mobile Responsive Navigation Bar */}
      <BottomNavBar />

      {/* Side Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <MugenziProvider>
      <MainContent />
    </MugenziProvider>
  );
}
