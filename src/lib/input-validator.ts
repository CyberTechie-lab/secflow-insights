import { InputType } from "@/types/scan";

const DOMAIN_REGEX = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
const URL_REGEX = /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

export function detectInputType(input: string): InputType {
  const trimmed = input.trim();
  
  if (!trimmed) return "invalid";
  
  if (URL_REGEX.test(trimmed)) {
    return "url";
  }
  
  if (DOMAIN_REGEX.test(trimmed)) {
    return "domain";
  }
  
  return "invalid";
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
}

export function formatElapsedTime(startTime: Date): string {
  const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
  return formatDuration(elapsed);
}
