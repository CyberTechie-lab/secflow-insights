import { Shield, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">
            Sec<span className="text-primary">Flow</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            New Scan
          </Link>
        </nav>
      </div>
    </header>
  );
}
