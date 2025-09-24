import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { useCurrency } from '../App';
import { formatCurrency } from '../utils/currency';

const allTransactions = [
  { id: 1, description: 'Grocery Shopping', payer: 'John Doe', amount: 89.50, date: '2024-03-15', status: 'Paid', group: 'House' },
  { id: 2, description: 'Uber to Airport', payer: 'Jane Smith', amount: 45.25, date: '2024-03-14', status: 'Pending', group: 'Trip' },
  { id: 3, description: 'Restaurant Bill', payer: 'Mike Johnson', amount: 156.75, date: '2024-03-13', status: 'Paid', group: 'Dinner' },
  { id: 4, description: 'Movie Tickets', payer: 'Sarah Wilson', amount: 32.00, date: '2024-03-12', status: 'Pending', group: 'Entertainment' },
  { id: 5, description: 'Coffee Shop', payer: 'Tom Brown', amount: 18.50, date: '2024-03-11', status: 'Paid', group: 'Office' },
  { id: 6, description: 'Gas Station', payer: 'John Doe', amount: 65.00, date: '2024-03-10', status: 'Paid', group: 'Trip' },
  { id: 7, description: 'Lunch Meeting', payer: 'Jane Smith', amount: 78.25, date: '2024-03-09', status: 'Pending', group: 'Office' },
  { id: 8, description: 'Groceries', payer: 'Mike Johnson', amount: 112.30, date: '2024-03-08', status: 'Paid', group: 'House' },
  { id: 9, description: 'Concert Tickets', payer: 'Sarah Wilson', amount: 95.00, date: '2024-03-07', status: 'Paid', group: 'Entertainment' },
  { id: 10, description: 'Hotel Booking', payer: 'Tom Brown', amount: 245.00, date: '2024-03-06', status: 'Pending', group: 'Trip' },
  { id: 11, description: 'Pharmacy', payer: 'John Doe', amount: 28.75, date: '2024-03-05', status: 'Paid', group: 'House' },
  { id: 12, description: 'Team Dinner', payer: 'Jane Smith', amount: 189.50, date: '2024-03-04', status: 'Paid', group: 'Office' },
];

const groups = ['All', 'House', 'Trip', 'Office', 'Dinner', 'Entertainment'];
const itemsPerPage = 8;

export function History() {
  const { currency } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filter transactions
  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.payer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'All' || transaction.group === selectedGroup;
    const matchesStatus = selectedStatus === 'All' || transaction.status === selectedStatus;
    
    return matchesSearch && matchesGroup && matchesStatus;
  });

  // Paginate
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">History</h1>
        <p className="text-muted-foreground">View and manage all your expense history</p>
      </div>
      
      {/* Filters */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Results</Label>
              <p className="text-sm text-muted-foreground pt-2">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Transactions Table */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{transaction.payer}</TableCell>
                  <TableCell>{formatCurrency(transaction.amount, currency)}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.group}</Badge>
                  </TableCell>
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
              </p>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}