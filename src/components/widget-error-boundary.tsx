"use client";

import { ReactNode } from "react";

interface WidgetErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackMessage?: string;
}

export function WidgetFallback({ message = "Data Unavailable" }: { message?: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
      <span>{message}</span>
    </div>
  );
}

// Simple error wrapper component
// For full error boundaries, use React's ErrorBoundary class component
export function WidgetWrapper({ 
  children, 
  hasError, 
  fallbackMessage = "Data Unavailable" 
}: { 
  children: ReactNode; 
  hasError: boolean; 
  fallbackMessage?: string;
}) {
  if (hasError) {
    return <WidgetFallback message={fallbackMessage} />;
  }
  return <>{children}</>;
}
