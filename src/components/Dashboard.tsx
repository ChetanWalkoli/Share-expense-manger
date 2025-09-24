import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  User, 
  Users, 
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useCurrency } from '../App';
import { formatCurrency } from '../utils/currency';
import FraudDetectionCard from './FraudDetectionCard';

const summaryData = {
  totalSpent: 2847.50,
  youOwe: 285.75,
  youAreOwed: 432.25
};

const chartData = [
  { group: 'House', balance: 125.50 },
  { group: 'Trip', balance: -89.25 },
  { group: 'Office', balance: 45.75 },
  { group: 'Dinner', balance: -32.00 },
];

const pieData = [
  { name: 'Food', value: 1200, color: '#8884d8' },
  { name: 'Transport', value: 800, color: '#82ca9d' },
  { name: 'Entertainment', value: 600, color: '#ffc658' },
  { name: 'Utilities', value: 400, color: '#ff7300' },
];

const recentTransactions = [
  { id: 1, description: 'Grocery Shopping', payer: 'John Doe', amount: 89.50, date: '2024-03-15', status: 'Paid' },
  { id: 2, description: 'Uber to Airport', payer: 'Jane Smith', amount: 45.25, date: '2024-03-14', status: 'Pending' },
  { id: 3, description: 'Restaurant Bill', payer: 'Mike Johnson', amount: 156.75, date: '2024-03-13', status: 'Paid' },
  { id: 4, description: 'Movie Tickets', payer: 'Sarah Wilson', amount: 32.00, date: '2024-03-12', status: 'Pending' },
  { id: 5, description: 'Coffee Shop', payer: 'Tom Brown', amount: 18.50, date: '2024-03-11', status: 'Paid' },
];

// Mock detailed breakdown data
const totalSpentBreakdown = [
  { id: 1, description: 'Dinner at Italian Restaurant', amount: 240.50, participants: ['John', 'Jane', 'Mike'], date: '2024-03-15', category: 'Food' },
  { id: 2, description: 'Grocery Shopping', amount: 156.75, participants: ['Jane', 'Mike', 'Tom'], date: '2024-03-13', category: 'Groceries' },
  { id: 3, description: 'Movie Night Tickets', amount: 85.00, participants: ['John', 'Sarah'], date: '2024-03-14', category: 'Entertainment' },
  { id: 4, description: 'Weekend Trip Gas', amount: 120.00, participants: ['John', 'Jane', 'Mike', 'Sarah'], date: '2024-03-10', category: 'Travel' },
  { id: 5, description: 'Coffee Shop Meeting', amount: 28.50, participants: ['Mike', 'Sarah', 'Tom'], date: '2024-03-11', category: 'Food' },
];

const youOweBreakdown = [
  { id: 1, description: 'Dinner at Italian Restaurant', amountOwed: 80.17, payer: 'John Doe', group: 'College Friends', date: '2024-03-15' },
  { id: 2, description: 'Movie Tickets', amountOwed: 42.50, payer: 'Sarah Wilson', group: 'Weekend Group', date: '2024-03-14' },
  { id: 3, description: 'Coffee Shop', amountOwed: 9.50, payer: 'Mike Johnson', group: 'Work Team', date: '2024-03-11' },
];

const youAreOwedBreakdown = [
  { id: 1, description: 'Grocery Shopping', amountOwed: 52.25, payer: 'Jane Smith', group: 'Roommates', date: '2024-03-13' },
  { id: 2, description: 'Weekend Trip Gas', amountOwed: 30.00, payer: 'Mike Johnson', group: 'Travel Group', date: '2024-03-10' },
  { id: 3, description: 'Uber to Airport', amountOwed: 22.62, payer: 'Sarah Wilson', group: 'College Friends', date: '2024-03-12' },
  { id: 4, description: 'Restaurant Bill', amountOwed: 39.25, payer: 'Tom Brown', group: 'Work Team', date: '2024-03-09' },
];

// Recent fraud detection results for dashboard
const recentFraudResults = [
  { 
    id: 1, 
    description: "Recent Restaurant Bill - $250.00", 
    score: 25, 
    reason: "Unusually high amount detected", 
    date: "2024-03-15" 
  },
  { 
    id: 2, 
    description: "Coffee Purchase - $12.50", 
    score: 95, 
    reason: "Normal spending pattern", 
    date: "2024-03-14" 
  }
];

export function Dashboard() {
  const { currency } = useCurrency();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardClick = (cardType: string) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food':
        return '🍕';
      case 'Groceries':
        return '🛒';
      case 'Entertainment':
        return '🎬';
      case 'Travel':
        return '✈️';
      default:
        return '💳';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your shared expenses</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Spent Card */}
        <Collapsible open={expandedCard === 'totalSpent'} onOpenChange={() => handleCardClick('totalSpent')}>
          <Card className="rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200">
            <CollapsibleTrigger asChild>
              <div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
                    Total Spent
                    <TrendingUp className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mb-2">{formatCurrency(summaryData.totalSpent, currency)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Click to view breakdown</span>
                    {expandedCard === 'totalSpent' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                  </div>
                </CardContent>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="border-t pt-4 space-y-3 max-h-64 overflow-y-auto">
                  <h4 className="font-medium text-sm">Expense Breakdown</h4>
                  {totalSpentBreakdown.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{expense.description}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {expense.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {expense.participants.length} people
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(expense.amount, currency)}</p>
                        <p className="text-xs text-muted-foreground">{expense.category}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between items-center font-medium">
                    <span>Total:</span>
                    <span>{formatCurrency(summaryData.totalSpent, currency)}</span>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        {/* You Owe Card */}
        <Collapsible open={expandedCard === 'youOwe'} onOpenChange={() => handleCardClick('youOwe')}>
          <Card className="rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200">
            <CollapsibleTrigger asChild>
              <div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
                    You Owe
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-red-600 mb-2">{formatCurrency(summaryData.youOwe, currency)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Click to view details</span>
                    {expandedCard === 'youOwe' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                  </div>
                </CardContent>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="border-t pt-4 space-y-3 max-h-64 overflow-y-auto">
                  <h4 className="font-medium text-sm">What You Owe</h4>
                  {youOweBreakdown.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{expense.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Paid by {expense.payer}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {expense.group}
                          </span>
                          <span>{expense.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">{formatCurrency(expense.amountOwed, currency)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between items-center font-medium text-red-600">
                    <span>Total Owed:</span>
                    <span>{formatCurrency(summaryData.youOwe, currency)}</span>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        
        {/* You Are Owed Card */}
        <Collapsible open={expandedCard === 'youAreOwed'} onOpenChange={() => handleCardClick('youAreOwed')}>
          <Card className="rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200">
            <CollapsibleTrigger asChild>
              <div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
                    You Are Owed
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600 mb-2">{formatCurrency(summaryData.youAreOwed, currency)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Click to view details</span>
                    {expandedCard === 'youAreOwed' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                  </div>
                </CardContent>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="border-t pt-4 space-y-3 max-h-64 overflow-y-auto">
                  <h4 className="font-medium text-sm">Who Owes You</h4>
                  {youAreOwedBreakdown.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{expense.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {expense.payer} owes you
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {expense.group}
                          </span>
                          <span>{expense.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{formatCurrency(expense.amountOwed, currency)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between items-center font-medium text-green-600">
                    <span>Total Owed to You:</span>
                    <span>{formatCurrency(summaryData.youAreOwed, currency)}</span>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Group Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value), currency), 'Balance']} />
                <Bar 
                  dataKey="balance" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(Number(value), currency), 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.payer}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount, currency)}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.status === 'Paid' ? 'default' : 'secondary'}
                        className={
                          transaction.status === 'Paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Fraud Detection */}
        <div className="space-y-4">
          <FraudDetectionCard results={recentFraudResults} />
        </div>
      </div>
    </div>
  );
}