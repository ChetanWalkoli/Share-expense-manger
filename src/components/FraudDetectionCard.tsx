import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertTriangle, Shield, Eye } from "lucide-react";

interface FraudResult {
  id: number;
  description: string;
  score: number;
  reason: string;
  date: string;
}

interface FraudDetectionCardProps {
  results: FraudResult[];
}

const getFraudStatus = (score: number) => {
  if (score > 70) {
    return {
      label: "Trustworthy",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-green-800 dark:text-green-300",
      badgeVariant: "default" as const,
      icon: Shield
    };
  } else if (score >= 40) {
    return {
      label: "Doubtful",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      textColor: "text-yellow-800 dark:text-yellow-300",
      badgeVariant: "secondary" as const,
      icon: Eye
    };
  } else {
    return {
      label: "Potentially Fraud",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      textColor: "text-red-800 dark:text-red-300",
      badgeVariant: "destructive" as const,
      icon: AlertTriangle
    };
  }
};

export default function FraudDetectionCard({ results }: FraudDetectionCardProps) {
  if (!results || results.length === 0) {
    return (
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Fraud Detection Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No fraud detection results available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Fraud Detection Results
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {results.length} transaction{results.length !== 1 ? 's' : ''} analyzed
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((result) => {
          const status = getFraudStatus(result.score);
          const IconComponent = status.icon;

          return (
            <div
              key={result.id}
              className={`${status.bgColor} rounded-xl p-4 transition-all duration-200 hover:shadow-md border border-border/50`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-4 w-4 ${status.textColor}`} />
                    <h4 className={`font-medium ${status.textColor}`}>
                      {result.description}
                    </h4>
                  </div>
                  
                  <p className={`text-sm ${status.textColor} opacity-80`}>
                    {result.reason}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${status.textColor} opacity-70`}>
                      {new Date(result.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${status.textColor}`}>
                        Score: {result.score}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant={status.badgeVariant}
                    className={`shrink-0 ${
                      result.score > 70 
                        ? 'bg-green-800 text-white dark:bg-green-700 dark:text-white hover:bg-green-700 dark:hover:bg-green-600' 
                        : ''
                    }`}
                  >
                    {status.label}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}