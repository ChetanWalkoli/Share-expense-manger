import React, { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { 
  Calendar,
  X, 
  Plus, 
  Search, 
  AlertTriangle,
  Loader2,
  UserPlus,
  Trash2,
  DollarSign,
  Brain,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useCurrency } from '../App';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

interface Participant {
  id: string;
  name: string;
  email?: string;
}

const initialParticipants: Participant[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' },
  { id: '5', name: 'Tom Brown', email: 'tom@example.com' },
  { id: '6', name: 'Emily Davis', email: 'emily@example.com' },
  { id: '7', name: 'Alex Chen', email: 'alex@example.com' },
];

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Travel',
  'Healthcare',
  'Education',
  'Bills & Utilities',
  'Groceries',
  'Sports & Fitness',
  'Other'
];

interface CurrencyConversion {
  convertedAmount: number;
  rate: number;
  isLoading: boolean;
  error: string | null;
}

export function EnhancedAddExpense() {
  const { currency } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [payer, setPayer] = useState<string>('');
  
  // Currency conversion state
  const [conversion, setConversion] = useState<CurrencyConversion>({
    convertedAmount: 0,
    rate: 0,
    isLoading: false,
    error: null
  });

  // Fair Split Suggestions state
  interface FairSplitSuggestion {
    [participantName: string]: {
      paid: number;
      fair_share: number;
      status: 'Overpayer' | 'Underpayer' | 'Balanced';
      next_split: number;
    };
  }

  const [fairSplitSuggestions, setFairSplitSuggestions] = useState<FairSplitSuggestion | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Currency conversion effect
  useEffect(() => {
    const convertCurrency = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        setConversion({ convertedAmount: 0, rate: 0, isLoading: false, error: null });
        return;
      }

      // Only convert if current currency is INR
      if (currency !== 'INR') {
        setConversion({ convertedAmount: 0, rate: 0, isLoading: false, error: null });
        return;
      }

      setConversion(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`https://api.exchangerate.host/convert?from=INR&to=USD&amount=${amount}`);
        const data = await response.json();
        
        if (data.success) {
          setConversion({
            convertedAmount: data.result,
            rate: data.info.rate,
            isLoading: false,
            error: null
          });
        } else {
          throw new Error('Conversion failed');
        }
      } catch (error) {
        setConversion({
          convertedAmount: 0,
          rate: 0,
          isLoading: false,
          error: 'Conversion unavailable'
        });
      }
    };

    const timeoutId = setTimeout(convertCurrency, 500); // Debounce API calls
    return () => clearTimeout(timeoutId);
  }, [amount, currency]);

  // Fair Split Suggestions effect
  useEffect(() => {
    const fetchFairSplitSuggestions = async () => {
      if (!amount || !payer || selectedParticipants.length === 0 || parseFloat(amount) <= 0) {
        setFairSplitSuggestions(null);
        return;
      }

      setIsLoadingSuggestions(true);
      setSuggestionsError(null);

      try {
        // Mock API call - replace with actual endpoint
        const mockResponse: FairSplitSuggestion = {};
        const totalAmount = parseFloat(amount);
        const fairShare = totalAmount / selectedParticipants.length;
        
        selectedParticipants.forEach((participant) => {
          const isPayer = participant.name === payer;
          const paid = isPayer ? totalAmount : 0;
          const difference = paid - fairShare;
          
          let status: 'Overpayer' | 'Underpayer' | 'Balanced';
          let nextSplit: number;
          
          if (Math.abs(difference) < 1) {
            status = 'Balanced';
            nextSplit = 1 / selectedParticipants.length;
          } else if (difference > 0) {
            status = 'Overpayer';
            nextSplit = Math.max(0.1, (fairShare - difference * 0.3) / totalAmount);
          } else {
            status = 'Underpayer';
            nextSplit = Math.min(0.6, (fairShare - difference * 0.5) / totalAmount);
          }
          
          mockResponse[participant.name] = {
            paid,
            fair_share: fairShare,
            status,
            next_split: nextSplit
          };
        });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setFairSplitSuggestions(mockResponse);
      } catch (error) {
        setSuggestionsError('Failed to fetch fair split suggestions');
        // Fallback to equal split
        const equalSplit: FairSplitSuggestion = {};
        const fairShare = parseFloat(amount) / selectedParticipants.length;
        
        selectedParticipants.forEach((participant) => {
          equalSplit[participant.name] = {
            paid: participant.name === payer ? parseFloat(amount) : 0,
            fair_share: fairShare,
            status: 'Balanced',
            next_split: 1 / selectedParticipants.length
          };
        });
        
        setFairSplitSuggestions(equalSplit);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchFairSplitSuggestions, 1000);
    return () => clearTimeout(timeoutId);
  }, [amount, payer, selectedParticipants]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (showDropdown && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showDropdown]);

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedParticipants.find(selected => selected.id === participant.id)
  );

  const handleAddParticipant = (participant: Participant) => {
    setSelectedParticipants([...selectedParticipants, participant]);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const handleRemoveParticipant = (participantId: string) => {
    setSelectedParticipants(selectedParticipants.filter(p => p.id !== participantId));
  };

  const handleAddNewMember = () => {
    if (!newMemberName.trim()) return;

    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      email: `${newMemberName.toLowerCase().replace(/\s+/g, '.')}@example.com`
    };

    setParticipants([...participants, newParticipant]);
    setSelectedParticipants([...selectedParticipants, newParticipant]);
    setNewMemberName('');
    setShowAddMember(false);
    setShowDropdown(false);
    toast.success(`${newParticipant.name} added to contacts and selected!`);
  };

  const handleRemoveMemberFromContacts = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    setParticipants(participants.filter(p => p.id !== participantId));
    setSelectedParticipants(selectedParticipants.filter(p => p.id !== participantId));
    toast.success(`${participant?.name} removed from contacts!`);
  };

  const handleAcceptSuggestion = () => {
    if (!fairSplitSuggestions) return;
    
    toast.success('Fair split suggestions applied!');
    // Here you could auto-fill split fields if you had them
    // For now, we'll just show a success message
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Overpayer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Underpayer':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Balanced':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !amount || !category || !payer || selectedParticipants.length === 0) {
      toast.error('Please fill in all required fields, select a payer, and select participants');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Expense added successfully!');
    
    // Reset form
    setTitle('');
    setAmount('');
    setCategory('');
    setPayer('');
    setSelectedParticipants([]);
    setDate(new Date().toISOString().split('T')[0]);
    setFairSplitSuggestions(null);
    setIsLoading(false);
  };

  const splitAmount = amount && selectedParticipants.length > 0 
    ? parseFloat(amount) / selectedParticipants.length 
    : 0;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-2">Add Expense</h1>
        <p className="text-muted-foreground">
          Record a new shared expense with dynamic participant management
        </p>
      </div>
      
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Expense Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Expense Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Dinner at Italian Restaurant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            {/* Amount, Category, Date, Payer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({getCurrencySymbol(currency)}) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                {/* Currency Conversion Display */}
                {currency === 'INR' && amount && parseFloat(amount) > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {conversion.isLoading ? (
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Converting...</span>
                      </div>
                    ) : conversion.error ? (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{conversion.error}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>
                          {parseFloat(amount).toLocaleString()} ₹ ≈ ${conversion.convertedAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payer">Who Paid? *</Label>
                <Select value={payer} onValueChange={setPayer} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payer" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedParticipants.map((participant) => (
                      <SelectItem key={participant.id} value={participant.name}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
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
            </div>
            
            {/* Participants Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Participants *</Label>
                <span className="text-sm text-muted-foreground">
                  {selectedParticipants.length} selected
                </span>
              </div>

              {/* Selected Participants - Badges */}
              {selectedParticipants.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                  {selectedParticipants.map((participant) => (
                    <Badge 
                      key={participant.id} 
                      variant="secondary" 
                      className="flex items-center gap-2 px-3 py-1.5"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{participant.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Participant Selector */}
              <div className="relative" ref={dropdownRef}>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      ref={searchInputRef}
                      placeholder="Search and add participants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddMember(!showAddMember)}
                    className="flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add New
                  </Button>
                </div>

                {/* Add New Member Form */}
                {showAddMember && (
                  <div className="mt-2 p-3 border rounded-lg bg-card">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter new member name"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddNewMember()}
                      />
                      <Button
                        type="button"
                        onClick={handleAddNewMember}
                        disabled={!newMemberName.trim()}
                        size="sm"
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddMember(false);
                          setNewMemberName('');
                        }}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {filteredParticipants.length > 0 ? (
                      filteredParticipants.map((participant) => (
                        <div key={participant.id} className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0">
                          <div className="flex items-center justify-between">
                            <div 
                              className="flex items-center gap-3 flex-1"
                              onClick={() => handleAddParticipant(participant)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{participant.name}</p>
                                {participant.email && (
                                  <p className="text-xs text-muted-foreground">{participant.email}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMemberFromContacts(participant.id);
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        <p>No participants found</p>
                        {searchTerm && (
                          <p className="text-xs mt-1">Try searching with a different name</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Split Preview */}
            {selectedParticipants.length > 0 && amount && (
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Split Preview</h4>
                      <div className="text-sm text-muted-foreground">
                        {selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold">{formatCurrency(parseFloat(amount), currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Amount per person:</span>
                        <span className="font-bold text-primary">{formatCurrency(splitAmount, currency)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      {selectedParticipants.map((participant) => (
                        <div key={participant.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">
                                {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{participant.name}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(splitAmount, currency)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fair Split Suggestions */}
            {selectedParticipants.length > 0 && amount && payer && (
              <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-800 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    AI Fair Split Suggestions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Smart recommendations based on historical patterns and fairness
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingSuggestions ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Analyzing fair split suggestions...</span>
                      </div>
                    </div>
                  ) : suggestionsError ? (
                    <div className="flex items-center gap-2 p-4 bg-yellow-100 text-yellow-800 rounded-lg dark:bg-yellow-900/20 dark:text-yellow-300">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{suggestionsError}. Using equal split as fallback.</span>
                    </div>
                  ) : fairSplitSuggestions ? (
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        {Object.entries(fairSplitSuggestions).map(([participantName, suggestion]) => (
                          <div
                            key={participantName}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border dark:bg-gray-900/50"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {participantName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{participantName}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Paid: {formatCurrency(suggestion.paid, currency)}</span>
                                  <span>Fair share: {formatCurrency(suggestion.fair_share, currency)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(suggestion.status)}>
                                {suggestion.status}
                              </Badge>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  Next Split: <span className="font-bold">{Math.round(suggestion.next_split * 100)}%</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Recommendations help maintain fairness across multiple expenses
                        </div>
                        <Button
                          type="button"
                          onClick={handleAcceptSuggestion}
                          className="bg-black text-white hover:bg-gray-800 rounded-lg"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Suggestion
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Expense...
                </div>
              ) : (
                'Add Expense'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}