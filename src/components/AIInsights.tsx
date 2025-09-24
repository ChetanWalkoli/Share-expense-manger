import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, TrendingUp, Users, DollarSign } from "lucide-react";
import { useCurrency } from '../App';
import { formatCurrency } from '../utils/currency';
import FraudDetectionCard from './FraudDetectionCard';

// Sample fraud detection results with varied scores
const fraudResults = [
  { 
    id: 1, 
    description: "Restaurant Bill - $250.00", 
    score: 85, 
    reason: "Unusually high amount for this category", 
    date: "2024-03-15" 
  },
  { 
    id: 2, 
    description: "Grocery Shopping - $89.50", 
    score: 55, 
    reason: "Duplicate transaction detected", 
    date: "2024-03-14" 
  },
  { 
    id: 3, 
    description: "Coffee Shop - $45.00", 
    score: 25, 
    reason: "Amount inconsistent with venue type", 
    date: "2024-03-13" 
  },
  { 
    id: 4, 
    description: "Movie Tickets - $75.00", 
    score: 72, 
    reason: "Transaction pattern looks normal", 
    date: "2024-03-12" 
  },
  { 
    id: 5, 
    description: "Gas Station - $150.00", 
    score: 35, 
    reason: "Unusual location and time pattern", 
    date: "2024-03-11" 
  },
  { 
    id: 6, 
    description: "Supermarket - $45.25", 
    score: 90, 
    reason: "Regular purchase pattern confirmed", 
    date: "2024-03-10" 
  }
];

const fairSplitSuggestions = [
  {
    id: 1,
    title: 'Settle with Mike Johnson',
    description: 'You owe Mike $125.50 from multiple transactions',
    amount: 125.50,
    type: 'owe',
    transactions: 3
  },
  {
    id: 2,
    title: 'Collect from Sarah Wilson',
    description: 'Sarah owes you $89.25 from dinner expenses',
    amount: 89.25,
    type: 'collect',
    transactions: 2
  },
  {
    id: 3,
    title: 'Group Settlement',
    description: 'Optimize payments for Trip group (4 people)',
    amount: 245.75,
    type: 'optimize',
    transactions: 8
  }
];

const insights = [
  {
    icon: TrendingUp,
    title: 'Spending Trend',
    value: '+15%',
    description: 'Higher than last month',
    color: 'text-orange-600'
  },
  {
    icon: Users,
    title: 'Active Groups',
    value: '4',
    description: 'Currently participating',
    color: 'text-blue-600'
  },
  {
    icon: DollarSign,
    title: 'Avg. Transaction',
    value: 67.50,
    description: 'This month',
    color: 'text-green-600'
  }
];

export function AIInsights() {
  const { currency } = useCurrency();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">AI Insights</h1>
        <p className="text-muted-foreground">Smart analysis of your expense patterns</p>
      </div>
      
      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const displayValue = typeof insight.value === 'number' 
            ? formatCurrency(insight.value, currency) 
            : insight.value;
          
          return (
            <Card key={index} className="rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{insight.title}</p>
                    <p className={`text-2xl font-semibold ${insight.color}`}>
                      {displayValue}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${insight.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Fraud Detection - Using the new FraudDetectionCard component */}
      <FraudDetectionCard results={fraudResults} />
      
      {/* Fair Split Suggestions */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Fair Split Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fairSplitSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-4 rounded-lg border bg-card">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.transactions} transaction{suggestion.transactions > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    suggestion.type === 'owe' ? 'text-red-600' :
                    suggestion.type === 'collect' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {formatCurrency(suggestion.amount, currency)}
                  </p>
                  <Badge variant={
                    suggestion.type === 'owe' ? 'destructive' :
                    suggestion.type === 'collect' ? 'default' : 'secondary'
                  }>
                    {suggestion.type === 'owe' ? 'You Owe' :
                     suggestion.type === 'collect' ? 'You Collect' : 'Optimize'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}