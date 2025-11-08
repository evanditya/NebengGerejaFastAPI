import { Link, useLocation } from "wouter";
import { Home, List, PlusCircle, User } from "lucide-react";

interface BottomNavProps {
  userRole?: string;
}

export default function BottomNav({ userRole }: BottomNavProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Beranda", icon: Home, show: true },
    { path: "/rides", label: "Tumpangan", icon: List, show: true },
    { path: "/post-ride", label: "Tawarkan", icon: PlusCircle, show: userRole === "driver" || userRole === "admin" },
    { path: "/profile", label: "Profil", icon: User, show: true },
  ];

  const visibleItems = navItems.filter(item => item.show);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50" data-testid="bottom-nav">
      <div className="flex justify-around items-center h-16 max-w-4xl mx-auto px-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <button className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] hover-elevate active-elevate-2 rounded-md">
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
