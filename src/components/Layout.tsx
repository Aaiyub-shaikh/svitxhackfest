import Navigation from './Navigation';
import AIChat from './AIChat';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <AIChat />
    </div>
  );
};

export default Layout;