import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your shared expenses</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${summaryData.totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">You Owe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">${summaryData.youOwe.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">You Are Owed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">${summaryData.youAreOwed.toFixed(2)}</div>
          </CardContent>
        </Card>
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
                <Tooltip formatter={(value) => [`$${value}`, 'Balance']} />
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
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
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
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
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
    </div>
  );
}