import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { StatusSpinner } from "@/components/StatusSpinner";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/services/api";
import { formatElapsedTime } from "@/lib/input-validator";
import { useToast } from "@/hooks/use-toast";

const POLL_INTERVAL = 5000; // 5 seconds

export default function ScanStatus() {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<"running" | "completed" | "failed">("running");
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState("0s");
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (!scanId) return;
    
    try {
      const result = await api.getScanStatus(scanId);
      setStatus(result.status);
      
      if (result.status === "completed") {
        toast({
          title: "Scan Complete",
          description: "Your vulnerability assessment is ready to view.",
        });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setStatus("failed");
      }
    }
  }, [scanId, toast]);

  // Poll for status updates
  useEffect(() => {
    if (status !== "running") return;
    
    checkStatus();
    const interval = setInterval(checkStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [status, checkStatus]);

  // Update elapsed time
  useEffect(() => {
    if (status !== "running") return;
    
    const interval = setInterval(() => {
      setElapsedTime(formatElapsedTime(startTime));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [status, startTime]);

  const handleViewResults = () => {
    navigate(`/scan/${scanId}/results`, { 
      state: location.state 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          {/* Status Indicator */}
          <div className="mb-8">
            {status === "running" && (
              <div className="flex flex-col items-center">
                <StatusSpinner size="lg" className="mb-6" />
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Scan in Progress
                </h1>
                <p className="text-muted-foreground mb-4">
                  Analyzing target for vulnerabilities...
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Elapsed: {elapsedTime}</span>
                </div>
              </div>
            )}

            {status === "completed" && (
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Scan Complete
                </h1>
                <p className="text-muted-foreground mb-6">
                  Your vulnerability assessment is ready.
                </p>
                <Button
                  size="lg"
                  onClick={handleViewResults}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  View Results
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {status === "failed" && (
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Scan Failed
                </h1>
                <p className="text-muted-foreground mb-4">
                  {error || "An error occurred during the scan."}
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="border-border hover:bg-muted"
                >
                  Start New Scan
                </Button>
              </div>
            )}
          </div>

          {/* Scan Details */}
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Scan ID</span>
              <code className="font-mono text-foreground">{scanId}</code>
            </div>
          </div>

          {status === "running" && (
            <p className="text-xs text-muted-foreground mt-6">
              Scans typically take 2-10 minutes depending on target size.
              <br />
              This page will automatically update when complete.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
