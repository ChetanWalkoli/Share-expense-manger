import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Plus, Calendar, DollarSign, AlertTriangle, TrendingUp, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner@2.0.3";
import { useCurrency } from '../App';
import { formatCurrency } from '../utils/currency';

interface ExpensePlan {
  id: string;
  name: string;
  description: string;
  budget: number;
  spent: number;
  category: string;
  startDate: Date;
  endDate: Date;
  participants: string[];
  expenses: Expense[];
  status: 'planning' | 'active' | 'completed' | 'exceeded';
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category: string;
}

const mockPlans: ExpensePlan[] = [
  {
    id: '1',
    name: 'Europe Trip 2024',
    description: 'Summer vacation across Europe',
    budget: 5000,
    spent: 3200,
    category: 'Travel',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-15'),
    participants: ['john@example.com', 'jane@example.com'],
    expenses: [
      { id: '1', amount: 1200, description: 'Flight tickets', date: new Date('2024-06-01'), category: 'Transportation' },
      { id: '2', amount: 800, description: 'Hotel booking', date: new Date('2024-06-02'), category: 'Accommodation' },
      { id: '3', amount: 1200, description: 'Daily expenses', date: new Date('2024-06-03'), category: 'Food' }
    ],
    status: 'active'
  },
  {
    id: '2',
    name: 'Office Equipment',
    description: 'New laptops and office furniture',
    budget: 8000,
    spent: 8500,
    category: 'Business',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    participants: ['team@company.com'],
    expenses: [
      { id: '1', amount: 4000, description: 'MacBook Pro x2', date: new Date('2024-01-15'), category: 'Equipment' },
      { id: '2', amount: 2500, description: 'Standing desks', date: new Date('2024-02-01'), category: 'Furniture' },
      { id: '3', amount: 2000, description: 'Office chairs', date: new Date('2024-02-15'), category: 'Furniture' }
    ],
    status: 'exceeded'
  }
];

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export function FutureExpense() {
  const [plans, setPlans] = useState<ExpensePlan[]>(mockPlans);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { currency } = useCurrency();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    category: '',
    startDate: '',
    endDate: '',
    participants: ['']
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addParticipantField = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, '']
    }));
  };

  const removeParticipantField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const updateParticipant = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((participant, i) => i === index ? value : participant)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.budget || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const budget = parseFloat(formData.budget);
    const validParticipants = formData.participants.filter(p => p.trim() !== '');

    const newPlan: ExpensePlan = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      budget,
      spent: 0,
      category: formData.category || 'Other',
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      participants: validParticipants,
      expenses: [],
      status: 'planning'
    };

    setPlans(prev => [newPlan, ...prev]);
    setFormData({
      name: '',
      description: '',
      budget: '',
      category: '',
      startDate: '',
      endDate: '',
      participants: ['']
    });
    setShowForm(false);
    
    toast.success(`Expense plan "${newPlan.name}" created successfully!`);
  };

  const deletePlan = (planId: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== planId));
    toast.success("Expense plan deleted successfully");
  };

  const addExpenseToPlan = (planId: string, amount: number, description: string) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        const newExpense: Expense = {
          id: Date.now().toString(),
          amount,
          description,
          date: new Date(),
          category: plan.category
        };
        
        const updatedSpent = plan.spent + amount;
        let newStatus = plan.status;
        
        if (updatedSpent > plan.budget) {
          newStatus = 'exceeded';
          toast.error(`Budget exceeded! You've spent ${formatCurrency(updatedSpent - plan.budget, currency)} over budget.`, {
            duration: 5000
          });
        }
        
        return {
          ...plan,
          spent: updatedSpent,
          expenses: [...plan.expenses, newExpense],
          status: newStatus
        };
      }
      return plan;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'exceeded': return 'bg-red-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressData = (plan: ExpensePlan) => {
    if (!plan.expenses.length) return [];
    
    const sortedExpenses = plan.expenses.sort((a, b) => a.date.getTime() - b.date.getTime());
    let cumulative = 0;
    
    return sortedExpenses.map((expense, index) => {
      cumulative += expense.amount;
      return {
        name: `Expense ${index + 1}`,
        amount: cumulative,
        budget: plan.budget,
        date: expense.date.toLocaleDateString()
      };
    });
  };

  const getCategoryData = (plan: ExpensePlan) => {
    const categories = plan.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Future Expense Planning</h1>
          <p className="text-muted-foreground">
            Plan and track your future expenses with budget limits and notifications.
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Plan
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Expense Plan</CardTitle>
            <CardDescription>
              Set up a budget plan for your upcoming expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Europe Trip 2024"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ({currency}) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the expense plan"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Participants</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addParticipantField}
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Participant
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.participants.map((participant, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={participant}
                        onChange={(e) => updateParticipant(index, e.target.value)}
                        placeholder="participant@example.com"
                        type="email"
                        className="flex-1"
                      />
                      {formData.participants.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeParticipantField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Plan</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <h2>Your Expense Plans</h2>
        {plans.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3>No expense plans yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first expense plan to start budgeting
              </p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => {
              const progress = (plan.spent / plan.budget) * 100;
              const isOverBudget = plan.spent > plan.budget;
              const progressData = getProgressData(plan);
              const categoryData = getCategoryData(plan);
              
              return (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          {plan.name}
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            {plan.startDate.toLocaleDateString()} - {plan.endDate.toLocaleDateString()}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <DollarSign className="h-3 w-3" />
                            {plan.category}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePlan(plan.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Budget Overview */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Budget Progress</span>
                        <span className={`font-medium ${isOverBudget ? 'text-red-500' : ''}`}>
                          {formatCurrency(plan.spent, currency)} / {formatCurrency(plan.budget, currency)}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className={`h-3 ${isOverBudget ? 'progress-red' : ''}`}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{progress.toFixed(1)}% used</span>
                        {isOverBudget && (
                          <span className="text-red-500 font-medium">
                            Over budget by {formatCurrency(plan.spent - plan.budget, currency)}
                          </span>
                        )}
                      </div>
                    </div>

                    {isOverBudget && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          This plan has exceeded its budget by {formatCurrency(plan.spent - plan.budget, currency)}.
                          Consider reviewing your expenses or adjusting the budget.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Charts */}
                    {plan.expenses.length > 0 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Progress Chart */}
                        <div className="space-y-2">
                          <h4>Spending Progress</h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={progressData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                  formatter={(value: number) => [formatCurrency(value, currency), 'Amount']}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="amount" 
                                  stroke="#8884d8" 
                                  strokeWidth={2}
                                  name="Spent"
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="budget" 
                                  stroke="#ff7c7c" 
                                  strokeDasharray="5 5"
                                  name="Budget"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="space-y-2">
                          <h4>Category Breakdown</h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={categoryData}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  dataKey="value"
                                  label={({ name, value }) => `${name}: ${formatCurrency(value, currency)}`}
                                >
                                  {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Add Expense */}
                    <div className="space-y-2">
                      <h4>Quick Add Expense</h4>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Amount" 
                          type="number" 
                          className="w-32"
                          id={`amount-${plan.id}`}
                        />
                        <Input 
                          placeholder="Description" 
                          className="flex-1"
                          id={`description-${plan.id}`}
                        />
                        <Button
                          onClick={() => {
                            const amountInput = document.getElementById(`amount-${plan.id}`) as HTMLInputElement;
                            const descInput = document.getElementById(`description-${plan.id}`) as HTMLInputElement;
                            
                            if (amountInput.value && descInput.value) {
                              addExpenseToPlan(plan.id, parseFloat(amountInput.value), descInput.value);
                              amountInput.value = '';
                              descInput.value = '';
                            }
                          }}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Recent Expenses */}
                    {plan.expenses.length > 0 && (
                      <div className="space-y-2">
                        <h4>Recent Expenses</h4>
                        <div className="space-y-2">
                          {plan.expenses.slice(-3).map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{expense.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  {expense.date.toLocaleDateString()} • {expense.category}
                                </p>
                              </div>
                              <span className="font-medium">
                                {formatCurrency(expense.amount, currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}