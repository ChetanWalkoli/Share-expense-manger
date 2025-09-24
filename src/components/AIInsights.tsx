import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, TrendingUp, Users, DollarSign } from "lucide-react";

const fraudAlerts = [
  {
    id: 1,
    transaction: 'Restaurant Bill - $250.00',
    reason: 'Unusually high amount for this category',
    confidence: 85,
    date: '2024-03-15'
  },
  {
    id: 2,
    transaction: 'Grocery Shopping - $89.50',
    reason: 'Duplicate transaction detected',
    confidence: 92,
    date: '2024-03-14'
  },
  {
    id: 3,
    transaction: 'Coffee Shop - $45.00',
    reason: 'Amount inconsistent with venue type',
    confidence: 78,
    date: '2024-03-13'
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
    value: '$67.50',
    description: 'This month',
    color: 'text-green-600'
  }
];

export function AIInsights() {
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
          return (
            <Card key={index} className="rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{insight.title}</p>
                    <p className={`text-2xl font-semibold ${insight.color}`}>
                      {insight.value}
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
      
      {/* Fraud Detection */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Fraud Detection Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fraudAlerts.map((alert) => (
            <Alert key={alert.id} className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <AlertDescription>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-red-800 dark:text-red-200">
                      {alert.transaction}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {alert.reason}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {alert.date}
                    </p>
                  </div>
                  <Badge 
                    variant="destructive" 
                    className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                  >
                    {alert.confidence}% confidence
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
      
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
                    ${suggestion.amount.toFixed(2)}
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