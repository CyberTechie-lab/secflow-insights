import { useState } from "react";
import { ChevronDown, ChevronRight, Server } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NmapHost } from "@/types/scan";
import { cn } from "@/lib/utils";

interface HostsTableProps {
  hosts: NmapHost[];
}

export function HostsTable({ hosts }: HostsTableProps) {
  const [expandedHosts, setExpandedHosts] = useState<Set<string>>(new Set());

  const toggleHost = (host: string) => {
    const newExpanded = new Set(expandedHosts);
    if (newExpanded.has(host)) {
      newExpanded.delete(host);
    } else {
      newExpanded.add(host);
    }
    setExpandedHosts(newExpanded);
  };

  if (hosts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No hosts discovered</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12"></TableHead>
            <TableHead>Host</TableHead>
            <TableHead className="text-right">Open Ports</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hosts.map((host) => {
            const isExpanded = expandedHosts.has(host.host);
            return (
              <>
                <TableRow
                  key={host.host}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => toggleHost(host.host)}
                >
                  <TableCell>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{host.host}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {host.ports.length} {host.ports.length === 1 ? "port" : "ports"}
                    </Badge>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow key={`${host.host}-details`}>
                    <TableCell colSpan={3} className="bg-muted/20 p-0">
                      <div className="p-4">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="text-xs">Port</TableHead>
                              <TableHead className="text-xs">State</TableHead>
                              <TableHead className="text-xs">Service</TableHead>
                              <TableHead className="text-xs">Version</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {host.ports.map((port) => (
                              <TableRow key={`${host.host}-${port.port}`} className="hover:bg-muted/30">
                                <TableCell className="font-mono text-sm">
                                  {port.port}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs",
                                      port.state === "open" && "border-success text-success",
                                      port.state === "filtered" && "border-warning text-warning",
                                      port.state === "closed" && "border-destructive text-destructive"
                                    )}
                                  >
                                    {port.state}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{port.service}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {port.version || "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
