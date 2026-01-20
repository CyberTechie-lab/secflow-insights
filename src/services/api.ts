import { ScanRequest, ScanResponse, ScanStatus, ScanReport } from "@/types/scan";

// Configure this when backend is deployed
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => "Unknown error");
    throw new ApiError(response.status, message);
  }
  return response.json();
}

export const api = {
  async startScan(request: ScanRequest): Promise<ScanResponse> {
    const response = await fetch(`${API_BASE_URL}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return handleResponse<ScanResponse>(response);
  },

  async getScanStatus(scanId: string): Promise<ScanStatus> {
    const response = await fetch(`${API_BASE_URL}/scan/${scanId}`);
    return handleResponse<ScanStatus>(response);
  },

  async getScanReport(scanId: string): Promise<ScanReport> {
    const response = await fetch(`${API_BASE_URL}/scan/${scanId}/report`);
    return handleResponse<ScanReport>(response);
  },
};

export { ApiError };
