import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Download,
  Trash2,
  Globe,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api, ApiError } from "@/services/api";
import { ScanListItem } from "@/types/scan";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [scans, setScans] = useState<ScanListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchScans = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const data = await api.listScans();
      setScans(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load scans");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const handleRefresh = () => {
    fetchScans(true);
  };

  const handleDelete = async (scanId: string) => {
    setDeletingId(scanId);
    try {
      await api.deleteScan(scanId);
      setScans((prev) => prev.filter((scan) => scan.scan_id !== scanId));
      toast({
        title: "Scan Deleted",
        description: "The scan has been removed successfully.",
      });
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err instanceof ApiError ? err.message : "Could not delete scan.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewResults = (scanId: string) => {
    navigate(`/scan/${scanId}/results`);
  };

  const handleDownload = (scanId: string) => {
    navigate(`/scan/${scanId}/results?download=true`);
  };

  const getStatusBadge = (status: ScanListItem["status"]) => {
    switch (status) {
      case "running":
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Running
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/30">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateSummary = (summary?: string, maxLength = 100) => {
    if (!summary) return null;
    if (summary.length <= maxLength) return summary;
    return summary.slice(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scan Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              View and manage your security scans
            </p>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing}
            className="border-border hover:bg-muted"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!error && scans.length === 0 && (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Scans Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start your first security scan to see results here.
            </p>
            <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
              Start New Scan
            </Button>
          </div>
        )}

        {/* Scans Table */}
        {!error && scans.length > 0 && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Domain/URL</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Created</TableHead>
                  <TableHead className="text-muted-foreground">AI Summary</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.map((scan) => (
                  <TableRow key={scan.scan_id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                        <code className="font-mono text-sm text-foreground truncate max-w-[200px]">
                          {scan.scope}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(scan.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(scan.created_at)}
                    </TableCell>
                    <TableCell>
                      {scan.ollama_enabled ? (
                        scan.ollama_summary ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-help max-w-[200px]">
                                <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
                                <span className="truncate">{truncateSummary(scan.ollama_summary)}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm bg-popover border-border">
                              <p className="text-sm">{scan.ollama_summary}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-sm text-muted-foreground/60">Pending...</span>
                        )
                      ) : (
                        <span className="text-sm text-muted-foreground/60">Not enabled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {scan.status === "completed" && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewResults(scan.scan_id)}
                                  className="h-8 w-8 hover:bg-muted"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Results</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload(scan.scan_id)}
                                  className="h-8 w-8 hover:bg-muted"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download PDF</TooltipContent>
                            </Tooltip>
                          </>
                        )}

                        {scan.status === "running" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/scan/${scan.scan_id}`)}
                                className="h-8 w-8 hover:bg-muted"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Progress</TooltipContent>
                          </Tooltip>
                        )}

                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={deletingId === scan.scan_id}
                                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  {deletingId === scan.scan_id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Delete Scan</TooltipContent>
                          </Tooltip>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">
                                Delete Scan
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Are you sure you want to delete this scan? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-border hover:bg-muted">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(scan.scan_id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
