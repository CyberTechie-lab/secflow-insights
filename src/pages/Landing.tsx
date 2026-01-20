import { Shield, Radar, Brain, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { ScanInput } from "@/components/ScanInput";
import { FeatureCard } from "@/components/FeatureCard";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Security</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Vulnerability Assessment
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            SecFlow is an automated VAPT platform that discovers attack surfaces, 
            identifies open ports and services, and provides AI-generated risk 
            analysis with actionable remediation steps.
          </p>
        </div>

        {/* Scan Input */}
        <div className="mb-20">
          <ScanInput />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={Radar}
            title="Asset Discovery"
            description="Automatically discover subdomains, endpoints, and attack surface for any target domain."
          />
          <FeatureCard
            icon={Shield}
            title="Port Scanning"
            description="Deep port scanning with service detection using industry-standard Nmap integration."
          />
          <FeatureCard
            icon={Brain}
            title="AI Analysis"
            description="Get intelligent risk assessments and remediation guidance powered by local LLM."
          />
          <FeatureCard
            icon={FileText}
            title="PDF Reports"
            description="Export comprehensive security reports in professional PDF format for stakeholders."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>SecFlow - AI-Powered Vulnerability Assessment Platform</p>
        </div>
      </footer>
    </div>
  );
}
