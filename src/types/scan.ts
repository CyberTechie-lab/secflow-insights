export interface ScanRequest {
  domain?: string;
  url?: string;
  ollama: boolean;
}

export interface ScanResponse {
  scan_id: string;
}

export interface ScanStatus {
  status: "running" | "completed" | "failed";
}

export interface NmapHost {
  host: string;
  ports: NmapPort[];
}

export interface NmapPort {
  port: number;
  state: string;
  service: string;
  version?: string;
}

export interface ScanReport {
  scope: string;
  duration_seconds: number;
  counts: {
    subdomains: number;
    urls: number;
    hosts: number;
    open_ports: number;
  };
  nmap_results: NmapHost[];
  ollama_summary?: string;
}

export type InputType = "domain" | "url" | "invalid";
