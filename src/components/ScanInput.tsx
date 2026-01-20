import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Link as LinkIcon, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { detectInputType } from "@/lib/input-validator";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { InputType } from "@/types/scan";

export function ScanInput() {
  const [input, setInput] = useState("");
  const [enableOllama, setEnableOllama] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const inputType = useMemo(() => detectInputType(input), [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputType === "invalid") {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid domain or URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const request = {
        ...(inputType === "domain" ? { domain: input.trim() } : { url: input.trim() }),
        ollama: enableOllama,
      };
      
      const response = await api.startScan(request);
      navigate(`/scan/${response.scan_id}`, { 
        state: { enableOllama } 
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Failed to start scan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputIcon = () => {
    switch (inputType) {
      case "domain":
        return <Globe className="h-5 w-5 text-primary" />;
      case "url":
        return <LinkIcon className="h-5 w-5 text-primary" />;
      default:
        return input ? <AlertCircle className="h-5 w-5 text-destructive" /> : <Globe className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getInputTypeLabel = (): string => {
    switch (inputType) {
      case "domain":
        return "Domain detected";
      case "url":
        return "URL detected";
      default:
        return input ? "Invalid format" : "Enter domain or URL";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {getInputIcon()}
          </div>
          <Input
            type="text"
            placeholder="example.com or https://example.com/path"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pl-12 pr-4 h-14 text-lg bg-card border-border focus:border-primary focus:ring-primary"
            disabled={isLoading}
          />
        </div>
        <p className={`text-sm ${inputType === "invalid" && input ? "text-destructive" : "text-muted-foreground"}`}>
          {getInputTypeLabel()}
        </p>
      </div>

      <div className="flex items-center space-x-3 p-4 rounded-lg bg-card border border-border">
        <Checkbox
          id="ollama"
          checked={enableOllama}
          onCheckedChange={(checked) => setEnableOllama(checked === true)}
          disabled={isLoading}
          className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <Label 
            htmlFor="ollama" 
            className="text-sm font-medium cursor-pointer"
          >
            Enable AI Risk Summary
          </Label>
        </div>
        <span className="text-xs text-muted-foreground ml-auto">
          Powered by Ollama
        </span>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
        disabled={isLoading || (inputType === "invalid" && !!input)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Initializing Scan...
          </>
        ) : (
          "Start Scan"
        )}
      </Button>
    </form>
  );
}
