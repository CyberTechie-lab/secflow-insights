import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Clock, 
  Globe, 
  Server, 
  Link as LinkIcon, 
  Download, 
  ArrowLeft,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { HostsTable } from "@/components/HostsTable";
import { AiSummary } from "@/components/AiSummary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ApiError } from "@/services/api";
import { ScanReport } from "@/types/scan";
import { formatDuration } from "@/lib/input-validator";
import { generatePdfReport } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";

export default function ScanResults() {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [report, setReport] = useState<ScanReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      if (!scanId) return;
      
      try {
        const data = await api.getScanReport(scanId);
        setReport(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load report");
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchReport();
  }, [scanId]);

  const handleDownloadPdf = async () => {
    if (!report || !scanId) return;
    
    setIsDownloading(true);
    try {
      generatePdfReport(report, scanId);
      toast({
        title: "Report Downloaded",
        description: "Your PDF report has been saved.",
      });
    } catch (err) {
      toast({
        title: "Download Failed",
        description: "Could not generate PDF report.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Failed to Load Report
            </h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground -ml-2"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Scan Results</h1>
            <p className="text-sm text-muted-foreground font-mono">{scanId}</p>
          </div>
          
          <Button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download PDF Report
          </Button>
        </div>

        {/* Scan Metadata */}
        <div className="p-4 rounded-lg bg-card border border-border mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Target:</span>
            <code className="font-mono text-foreground">{report.scope}</code>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Clock}
            label="Duration"
            value={formatDuration(report.duration_seconds)}
          />
          <MetricCard
            icon={Globe}
            label="Subdomains"
            value={report.counts.subdomains}
          />
          <MetricCard
            icon={LinkIcon}
            label="URLs"
            value={report.counts.urls}
          />
          <MetricCard
            icon={Server}
            label="Open Ports"
            value={report.counts.open_ports}
          />
        </div>

        {/* AI Summary */}
        {report.ollama_summary && (
          <div className="mb-8">
            <AiSummary summary={report.ollama_summary} />
          </div>
        )}

        {/* Hosts Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Discovered Hosts & Services
          </h2>
          <HostsTable hosts={report.nmap_results} />
        </div>
      </main>
    </div>
  );
}
