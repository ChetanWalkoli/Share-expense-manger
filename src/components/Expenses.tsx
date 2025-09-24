import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { 
  Receipt, 
  Calendar, 
  Users, 
  DollarSign,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  X,
  Clock,
  FileText,
  Star,
  Eye,
  User,
  CreditCard,
  Split,
  Plus,
  Trash2,
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from '../App';
import { formatCurrency } from '../utils/currency';
import { toast } from "sonner";

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  time: string;
  category: string;
  participants: { id: string; name: string; amount: number }[];
  payer: string;
  status: 'settled' | 'pending';
  notes?: string;
  location?: string;
  paymentMethod?: string;
}

// Mock expenses data with enhanced details
const mockExpenses: Expense[] = [
  {
    id: '1',
    title: 'Dinner at Italian Restaurant',
    amount: 240.50,
    date: '2024-03-15',
    time: '19:30',
    category: 'Food & Dining',
    participants: [
      { id: '1', name: 'John Doe', amount: 80.17 },
      { id: '2', name: 'Jane Smith', amount: 80.17 },
      { id: '3', name: 'Mike Johnson', amount: 80.16 }
    ],
    payer: 'John Doe',
    status: 'pending',
    notes: 'Birthday celebration for Mike. Great pasta and wine!',
    location: 'Tony\'s Italian Bistro',
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    title: 'Movie Night Tickets',
    amount: 85.00,
    date: '2024-03-14',
    time: '20:00',
    category: 'Entertainment',
    participants: [
      { id: '1', name: 'John Doe', amount: 42.50 },
      { id: '4', name: 'Sarah Wilson', amount: 42.50 }
    ],
    payer: 'Sarah Wilson',
    status: 'settled',
    notes: 'Watched the new Marvel movie. Popcorn and drinks included.',
    location: 'AMC Theater',
    paymentMethod: 'Debit Card'
  },
  {
    id: '3',
    title: 'Grocery Shopping',
    amount: 156.75,
    date: '2024-03-13',
    time: '14:20',
    category: 'Groceries',
    participants: [
      { id: '2', name: 'Jane Smith', amount: 52.25 },
      { id: '3', name: 'Mike Johnson', amount: 52.25 },
      { id: '5', name: 'Tom Brown', amount: 52.25 }
    ],
    payer: 'Jane Smith',
    status: 'pending',
    notes: 'Weekly grocery run. Bought ingredients for weekend BBQ.',
    location: 'Whole Foods Market',
    paymentMethod: 'Cash'
  },
  {
    id: '4',
    title: 'Uber to Airport',
    amount: 45.20,
    date: '2024-03-12',
    time: '06:15',
    category: 'Transportation',
    participants: [
      { id: '1', name: 'John Doe', amount: 22.60 },
      { id: '2', name: 'Jane Smith', amount: 22.60 }
    ],
    payer: 'John Doe',
    status: 'settled',
    notes: 'Early morning flight to San Francisco.',
    location: 'LAX Airport',
    paymentMethod: 'Uber App'
  },
  {
    id: '5',
    title: 'Coffee Shop Meeting',
    amount: 28.50,
    date: '2024-03-11',
    time: '10:00',
    category: 'Food & Dining',
    participants: [
      { id: '3', name: 'Mike Johnson', amount: 9.50 },
      { id: '4', name: 'Sarah Wilson', amount: 9.50 },
      { id: '5', name: 'Tom Brown', amount: 9.50 }
    ],
    payer: 'Mike Johnson',
    status: 'pending',
    notes: 'Discussed the quarterly project plans over coffee.',
    location: 'Starbucks Downtown',
    paymentMethod: 'Mobile Pay'
  },
  {
    id: '6',
    title: 'Weekend Trip Gas',
    amount: 120.00,
    date: '2024-03-10',
    time: '08:30',
    category: 'Travel',
    participants: [
      { id: '1', name: 'John Doe', amount: 30.00 },
      { id: '2', name: 'Jane Smith', amount: 30.00 },
      { id: '3', name: 'Mike Johnson', amount: 30.00 },
      { id: '4', name: 'Sarah Wilson', amount: 30.00 }
    ],
    payer: 'John Doe',
    status: 'settled',
    notes: 'Gas for the road trip to Yosemite National Park.',
    location: 'Shell Gas Station',
    paymentMethod: 'Credit Card'
  }
];

const categories = [
  'All Categories',
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Travel',
  'Groceries',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Other'
];

const getCategoryColor = (category: string) => {
  const colors = {
    'Food & Dining': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    'Transportation': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'Entertainment': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    'Travel': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'Groceries': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'Shopping': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
    'Bills & Utilities': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    'Healthcare': 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
    'Education': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
    'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  };
  return colors[category as keyof typeof colors] || colors['Other'];
};

const getCategoryIcon = (category: string) => {
  const icons = {
    'Food & Dining': '🍽️',
    'Transportation': '🚗',
    'Entertainment': '🎬',
    'Travel': '✈️',
    'Groceries': '🛒',
    'Shopping': '🛍️',
    'Bills & Utilities': '💡',
    'Healthcare': '🏥',
    'Education': '📚',
    'Other': '📋'
  };
  return icons[category as keyof typeof icons] || icons['Other'];
};

export function Expenses() {
  const { currency } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedExpense(null), 300); // Wait for animation to complete
  };

  const handleToggleSettled = (expenseId: string) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => {
        if (expense.id === expenseId) {
          const newStatus = expense.status === 'settled' ? 'pending' : 'settled';
          const updatedExpense = { ...expense, status: newStatus };
          
          // Update selected expense if it's the same one
          if (selectedExpense?.id === expenseId) {
            setSelectedExpense(updatedExpense);
          }
          
          // Show toast notification
          toast.success(
            newStatus === 'settled' 
              ? `"${expense.title}" marked as settled! ✅` 
              : `"${expense.title}" marked as pending 📋`
          );
          
          return updatedExpense;
        }
        return expense;
      })
    );
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
    setIsModalOpen(false); // Close the detail modal
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => setEditingExpense(null), 300);
  };

  const handleSaveExpense = (updatedExpense: Expense) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    
    // Update selected expense if it's the same one
    if (selectedExpense?.id === updatedExpense.id) {
      setSelectedExpense(updatedExpense);
    }
    
    toast.success(`"${updatedExpense.title}" updated successfully! 🎉`);
    closeEditModal();
  };

  // Filter and sort expenses
  const filteredAndSortedExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.payer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || expense.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 flex items-center gap-2">
            <Receipt className="h-7 w-7" />
            Expenses
          </h1>
          <p className="text-muted-foreground">
            View and manage all your shared expenses
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="font-bold">{totalExpenses} expenses</p>
          <p className="text-sm font-medium">{formatCurrency(totalAmount, currency)}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {selectedCategory}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: 'date' | 'amount' | 'title') => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="shrink-0"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredAndSortedExpenses.length > 0 ? (
          filteredAndSortedExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card 
                className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
                onClick={() => handleExpenseClick(expense)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{expense.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={getCategoryColor(expense.category)}
                            >
                              {expense.category}
                            </Badge>
                            <Badge 
                              variant={expense.status === 'settled' ? 'default' : 'secondary'}
                              className={expense.status === 'settled' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                              }
                            >
                              {expense.status === 'settled' ? 'Settled' : 'Pending'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(expense.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>

                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Paid by <span className="font-medium text-blue-600 dark:text-blue-400">{expense.payer}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {expense.participants.length} participant{expense.participants.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* Participants Preview */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {expense.participants.slice(0, 4).map((participant, index) => (
                            <Avatar key={participant.id} className="h-7 w-7 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {expense.participants.length > 4 && (
                            <div className="h-7 w-7 bg-muted rounded-full flex items-center justify-center border-2 border-background">
                              <span className="text-xs text-muted-foreground">
                                +{expense.participants.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatCurrency(expense.amount, currency)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(expense.participants[0]?.amount || 0, currency)} each
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No expenses found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== 'All Categories' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding your first shared expense'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Expense Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              {selectedExpense && (
                <>
                  <span className="text-3xl">{getCategoryIcon(selectedExpense.category)}</span>
                  {selectedExpense.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedExpense && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={getCategoryColor(selectedExpense.category)}
                    >
                      {selectedExpense.category}
                    </Badge>
                    <Badge 
                      variant={selectedExpense.status === 'settled' ? 'default' : 'secondary'}
                      className={selectedExpense.status === 'settled' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      }
                    >
                      {selectedExpense.status === 'settled' ? 'Settled' : 'Pending'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(selectedExpense.amount, currency)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date & Time */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Date & Time</h4>
                  </div>
                  <div className="pl-7 space-y-1">
                    <p className="font-medium">
                      {new Date(selectedExpense.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedExpense.time}
                    </p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Payment Details</h4>
                  </div>
                  <div className="pl-7 space-y-1">
                    <p>
                      Paid by <span className="font-medium text-blue-600 dark:text-blue-400">{selectedExpense.payer}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedExpense.paymentMethod}
                    </p>
                    {selectedExpense.location && (
                      <p className="text-sm text-muted-foreground">
                        📍 {selectedExpense.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Participants & Split */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Split className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium">Participants & Split ({selectedExpense.participants.length} people)</h4>
                </div>
                <div className="space-y-3">
                  {selectedExpense.participants.map((participant) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        participant.name === selectedExpense.payer 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                          : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {participant.name}
                            {participant.name === selectedExpense.payer && (
                              <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                            )}
                          </p>
                          {participant.name === selectedExpense.payer && (
                            <p className="text-xs text-blue-600 dark:text-blue-400">Paid the bill</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(participant.amount, currency)}</p>
                        <p className="text-xs text-muted-foreground">
                          {((participant.amount / selectedExpense.amount) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedExpense.notes && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <h4 className="font-medium">Notes</h4>
                    </div>
                    <div className="pl-7">
                      <p className="text-muted-foreground italic bg-muted/50 p-3 rounded-lg">
                        "{selectedExpense.notes}"
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <Separator />
              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1"
                  variant={selectedExpense.status === 'settled' ? 'secondary' : 'default'}
                  onClick={() => handleToggleSettled(selectedExpense.id)}
                >
                  {selectedExpense.status === 'settled' ? 'Mark as Pending' : 'Mark as Settled'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleEditExpense(selectedExpense)}
                >
                  Edit Expense
                </Button>
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Expense Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              {editingExpense && (
                <>
                  <span className="text-3xl">{getCategoryIcon(editingExpense.category)}</span>
                  Edit Expense
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {editingExpense && (
            <EditExpenseForm 
              expense={editingExpense}
              onSave={handleSaveExpense}
              onCancel={closeEditModal}
              categories={categories.filter(cat => cat !== 'All Categories')}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Expense Form Component
function EditExpenseForm({ 
  expense, 
  onSave, 
  onCancel, 
  categories 
}: { 
  expense: Expense; 
  onSave: (expense: Expense) => void; 
  onCancel: () => void;
  categories: string[];
}) {
  const { currency } = useCurrency();
  const [formData, setFormData] = useState({
    title: expense.title,
    amount: expense.amount.toString(),
    category: expense.category,
    notes: expense.notes || '',
    location: expense.location || '',
    paymentMethod: expense.paymentMethod || ''
  });
  
  const [participants, setParticipants] = useState(expense.participants);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [selectedPayer, setSelectedPayer] = useState(expense.payer);

  const addParticipant = () => {
    if (!newParticipantName.trim()) {
      toast.error('Please enter a participant name');
      return;
    }

    // Check if participant already exists
    if (participants.some(p => p.name.toLowerCase() === newParticipantName.trim().toLowerCase())) {
      toast.error('Participant already exists');
      return;
    }

    const newParticipant = {
      id: Date.now().toString(), // Simple ID generation
      name: newParticipantName.trim(),
      amount: 0 // Will be recalculated
    };

    setParticipants(prev => [...prev, newParticipant]);
    setNewParticipantName('');
    toast.success(`${newParticipant.name} added successfully!`);
  };

  const removeParticipant = (participantId: string) => {
    if (participants.length <= 1) {
      toast.error('Cannot remove participant. At least one participant is required.');
      return;
    }

    const participantToRemove = participants.find(p => p.id === participantId);
    if (!participantToRemove) return;

    setParticipants(prev => prev.filter(p => p.id !== participantId));
    
    // If the removed participant was the payer, set the first remaining participant as payer
    if (selectedPayer === participantToRemove.name) {
      const remainingParticipants = participants.filter(p => p.id !== participantId);
      if (remainingParticipants.length > 0) {
        setSelectedPayer(remainingParticipants[0].name);
      }
    }
    
    toast.success(`${participantToRemove.name} removed successfully!`);
  };

  // Calculate split amount
  const splitAmount = participants.length > 0 ? parseFloat(formData.amount || '0') / participants.length : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.amount.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (participants.length === 0) {
      toast.error('At least one participant is required');
      return;
    }

    // Validate that selected payer exists in participants
    if (!participants.some(p => p.name === selectedPayer)) {
      toast.error('Selected payer must be one of the participants');
      return;
    }

    // Calculate new participant amounts based on the new total and participants
    const amountPerPerson = amount / participants.length;
    const updatedParticipants = participants.map(participant => ({
      ...participant,
      amount: amountPerPerson
    }));

    const updatedExpense: Expense = {
      ...expense,
      title: formData.title.trim(),
      amount: amount,
      category: formData.category,
      notes: formData.notes.trim(),
      location: formData.location.trim(),
      paymentMethod: formData.paymentMethod.trim(),
      participants: updatedParticipants,
      payer: selectedPayer
    };

    onSave(updatedExpense);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Expense Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter expense title..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({currency}) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      <span>{getCategoryIcon(category)}</span>
                      {category}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Where was this expense?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Input
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              placeholder="How was this paid?"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Any additional notes about this expense..."
            rows={3}
          />
        </div>
      </div>

      <Separator />

      {/* Participants Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium">Participants ({participants.length} people)</h4>
            <Badge variant="secondary" className="text-xs">
              {formatCurrency(splitAmount, currency)} each
            </Badge>
          </div>
        </div>

        {/* Add New Participant */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter participant name..."
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={addParticipant}
            className="shrink-0"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Current Participants */}
        <div className="space-y-2">
          {participants.map((participant) => (
            <motion.div 
              key={participant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{participant.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(splitAmount, currency)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Payer Selection */}
                <Button
                  type="button"
                  variant={selectedPayer === participant.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPayer(participant.name)}
                  className="text-xs h-7"
                >
                  {selectedPayer === participant.name ? (
                    <>
                      <Star className="h-3 w-3 mr-1" fill="currentColor" />
                      Payer
                    </>
                  ) : (
                    'Set as Payer'
                  )}
                </Button>
                
                {/* Remove Participant */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeParticipant(participant.id)}
                  disabled={participants.length <= 1}
                  className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {participants.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No participants yet</p>
            <p className="text-xs">Add at least one participant to continue</p>
          </div>
        )}

        {/* Payer Selection (Alternative Method) */}
        {participants.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="payer">Who paid for this expense?</Label>
            <Select value={selectedPayer} onValueChange={setSelectedPayer}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                    {selectedPayer || 'Select payer...'}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {participants.map((participant) => (
                  <SelectItem key={participant.id} value={participant.name}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {participant.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </motion.form>
  );
}