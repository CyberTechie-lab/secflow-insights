import { Sparkles } from "lucide-react";

interface AiSummaryProps {
  summary: string;
}

export function AiSummary({ summary }: AiSummaryProps) {
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 card-glow">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">AI Risk Analysis</h3>
        <span className="text-xs text-muted-foreground ml-auto">Powered by Ollama</span>
      </div>
      <div className="prose prose-invert prose-sm max-w-none">
        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {summary}
        </p>
      </div>
    </div>
  );
}
