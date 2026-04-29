"use client";

import { useState, useEffect } from "react";
import { Copy, Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiKeyDisplayProps {
  apiKey: string;
  label?: string;
  className?: string;
  autoHideDelay?: number; // Auto-hide after this many seconds when visible
}

export function ApiKeyDisplay({ 
  apiKey, 
  label = "API Key", 
  className,
  autoHideDelay = 30 // Default 30 seconds
}: ApiKeyDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(autoHideDelay);

  // Auto-hide the key after specified delay with countdown
  useEffect(() => {
    if (isVisible && autoHideDelay > 0) {
      setTimeLeft(autoHideDelay);
      
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsVisible(false);
            return autoHideDelay;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible, autoHideDelay]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy API key:", err);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    
    // For longer keys, show first 6 and last 4 characters
    if (key.length > 20) {
      const start = key.slice(0, 6);
      const end = key.slice(-4);
      const middle = "•".repeat(12); // Fixed length for consistency
      return `${start}${middle}${end}`;
    }
    
    // For shorter keys, show first 4 and last 4
    const start = key.slice(0, 4);
    const end = key.slice(-4);
    const middle = "•".repeat(Math.min(key.length - 8, 8));
    return `${start}${middle}${end}`;
  };

  const displayKey = isVisible ? apiKey : maskKey(apiKey);

  return (
    <div className={cn("retro-card-static bg-gray-50 p-3", className)}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-600 retro-mono">
          <span>{label}</span>
          {isVisible && timeLeft <= 5 && (
            <span className="text-orange-600 animate-pulse">
              ({timeLeft}s)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleVisibility}
            className="retro-button-sm p-1.5 bg-white hover:bg-gray-100 transition-colors"
            title={isVisible ? "Hide API key" : "Show API key"}
          >
            {isVisible ? (
              <EyeOff className="h-3 w-3 text-gray-600" />
            ) : (
              <Eye className="h-3 w-3 text-gray-600" />
            )}
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              "retro-button-sm p-1.5 transition-colors",
              isCopied 
                ? "bg-green-100 text-green-700 border-green-400" 
                : "bg-white hover:bg-gray-100 text-gray-600"
            )}
            title="Copy API key"
          >
            {isCopied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
      <div className="relative">
        <code className="block break-all text-xs retro-mono text-gray-900 select-all transition-all duration-200">
          {displayKey}
        </code>
        {isCopied && (
          <div className="absolute -top-10 right-0 z-10 retro-card-static bg-green-100 text-green-800 px-3 py-1 text-xs retro-mono animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              <span>Copied!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}