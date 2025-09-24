import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner@2.0.3";
import { useCurrency } from '../App';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

const users = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Wilson' },
  { id: '5', name: 'Tom Brown' },
];

export function AddExpense() {
  const { currency } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [payer, setPayer] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleParticipantChange = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedParticipants([...selectedParticipants, userId]);
    } else {
      setSelectedParticipants(selectedParticipants.filter(id => id !== userId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payer || !amount || !description || selectedParticipants.length === 0) {
      toast.error('Please fill in all fields and select participants');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Expense added successfully!');
    
    // Reset form
    setDescription('');
    setAmount('');
    setPayer('');
    setSelectedParticipants([]);
    setIsLoading(false);
  };

  const splitAmount = amount ? formatCurrency(parseFloat(amount) / selectedParticipants.length, currency) : formatCurrency(0, currency);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Add Expense</h1>
        <p className="text-muted-foreground">Record a new shared expense</p>
      </div>
      
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({getCurrencySymbol(currency)})</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payer">Who Paid?</Label>
                <Select value={payer} onValueChange={setPayer} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payer" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Select Participants</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`participant-${user.id}`}
                      checked={selectedParticipants.includes(user.id)}
                      onCheckedChange={(checked) => 
                        handleParticipantChange(user.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`participant-${user.id}`}
                      className="text-sm"
                    >
                      {user.name}
                    </Label>
                  </div>
                ))}
              </div>
              
              {selectedParticipants.length > 0 && amount && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Split among {selectedParticipants.length} people: 
                    <span className="ml-2 font-semibold text-foreground">
                      {splitAmount} each
                    </span>
                  </p>
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Adding Expense...' : 'Add Expense'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}