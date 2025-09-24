import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { 
  User, 
  Mail, 
  DollarSign, 
  Settings, 
  Bell, 
  Trophy, 
  Target, 
  TrendingUp, 
  Users, 
  Award,
  Star,
  Heart,
  Zap,
  Shield,
  Camera,
  Edit
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCurrency } from '../App';
import { formatCurrency } from '../utils/currency';
import { currencies } from '../utils/currency';
import { toast } from "sonner@2.0.3";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  defaultCurrency: string;
  defaultSplitPreference: 'equal' | 'custom';
  notificationsEnabled: boolean;
  favoriteCategories: string[];
  trustScore: number;
  badges: string[];
}

interface UserStats {
  totalExpensesLifetime: number;
  totalExpensesMonthly: number;
  topCategories: { name: string; amount: number; percentage: number }[];
  mostActiveGroup: string;
  contributionRatio: number;
  aiInsight: string;
}

const mockUserProfile: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: '',
  defaultCurrency: 'USD',
  defaultSplitPreference: 'equal',
  notificationsEnabled: true,
  favoriteCategories: ['Food', 'Travel', 'Entertainment'],
  trustScore: 92,
  badges: ['Generous Friend', 'Fair Splitter', 'Travel Buddy', 'Early Adopter']
};

const mockUserStats: UserStats = {
  totalExpensesLifetime: 25430,
  totalExpensesMonthly: 1850,
  topCategories: [
    { name: 'Food', amount: 650, percentage: 35 },
    { name: 'Travel', amount: 480, percentage: 26 },
    { name: 'Entertainment', amount: 320, percentage: 17 }
  ],
  mostActiveGroup: 'College Friends',
  contributionRatio: 1.25, // 25% more than average
  aiInsight: 'You spent $1,850 last month, mostly on Food 🍕. You usually contribute 25% more than others, showing your generous nature!'
};

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

const allCategories = [
  'Food', 'Travel', 'Entertainment', 'Shopping', 'Transportation', 
  'Healthcare', 'Education', 'Bills', 'Groceries', 'Sports'
];

const badgeIcons = {
  'Generous Friend': Heart,
  'Fair Splitter': Target,
  'Travel Buddy': Trophy,
  'Early Adopter': Zap,
  'Trust Builder': Shield,
  'Group Leader': Award
};

export function Profile() {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [stats] = useState<UserStats>(mockUserStats);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const { currency } = useCurrency();

  const handleSaveProfile = () => {
    setProfile(editForm);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const toggleFavoriteCategory = (category: string) => {
    setEditForm(prev => ({
      ...prev,
      favoriteCategories: prev.favoriteCategories.includes(category)
        ? prev.favoriteCategories.filter(c => c !== category)
        : [...prev.favoriteCategories, category]
    }));
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings, preferences, and view your expense insights.
          </p>
        </div>
        <Button 
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-lg">
                      {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3 w-full">
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <h3>{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                )}
              </div>

              <Separator />
              
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Default Currency
                </Label>
                {isEditing ? (
                  <Select 
                    value={editForm.defaultCurrency} 
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, defaultCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.symbol} {curr.code} - {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{currencies.find(c => c.code === profile.defaultCurrency)?.symbol} {profile.defaultCurrency}</span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust Score & Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Trust Score & Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-3xl font-bold ${getTrustScoreColor(profile.trustScore)}`}>
                    {profile.trustScore}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-medium">Trust Score</p>
                    <p className={`text-xs ${getTrustScoreColor(profile.trustScore)}`}>
                      {getTrustScoreLabel(profile.trustScore)}
                    </p>
                  </div>
                </div>
                <Progress value={profile.trustScore} className="h-2" />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Achievements
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {profile.badges.map((badge, index) => {
                    const IconComponent = badgeIcons[badge as keyof typeof badgeIcons] || Award;
                    return (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-1 justify-center p-2"
                      >
                        <IconComponent className="h-3 w-3" />
                        <span className="text-xs">{badge}</span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preferences & Insights */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>
                Configure your default settings and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label>Default Split Preference</Label>
                  {isEditing ? (
                    <Select 
                      value={editForm.defaultSplitPreference} 
                      onValueChange={(value: 'equal' | 'custom') => 
                        setEditForm(prev => ({ ...prev, defaultSplitPreference: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equal">Equal Split</SelectItem>
                        <SelectItem value="custom">Custom Split</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{profile.defaultSplitPreference} Split</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </Label>
                  <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <Switch
                      checked={isEditing ? editForm.notificationsEnabled : profile.notificationsEnabled}
                      onCheckedChange={(checked) => 
                        isEditing && setEditForm(prev => ({ ...prev, notificationsEnabled: checked }))
                      }
                      disabled={!isEditing}
                    />
                    <span className="text-sm">
                      {(isEditing ? editForm.notificationsEnabled : profile.notificationsEnabled) 
                        ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Favorite Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => {
                    const isSelected = isEditing 
                      ? editForm.favoriteCategories.includes(category)
                      : profile.favoriteCategories.includes(category);
                    
                    return (
                      <Badge
                        key={category}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          isEditing ? 'hover:bg-primary/80' : ''
                        }`}
                        onClick={() => isEditing && toggleFavoriteCategory(category)}
                      >
                        {category}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Box */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{stats.aiInsight}</p>
            </CardContent>
          </Card>

          {/* Expense Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Expense Insights
              </CardTitle>
              <CardDescription>
                Your spending patterns and contribution statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total Expenses */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Lifetime Expenses</Label>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalExpensesLifetime, currency)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">This Month</Label>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalExpensesMonthly, currency)}</p>
                </div>
              </div>

              <Separator />

              {/* Top Categories */}
              <div className="space-y-4">
                <h4>Top 3 Spending Categories</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    {stats.topCategories.map((category, index) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatCurrency(category.amount, currency)} ({category.percentage}%)
                          </span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.topCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="amount"
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                        >
                          {stats.topCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Stats */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Most Active Group
                  </Label>
                  <p className="font-medium">{stats.mostActiveGroup}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Contribution Ratio
                  </Label>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {stats.contributionRatio.toFixed(2)}x
                    </p>
                    <Badge variant={stats.contributionRatio > 1 ? "default" : "secondary"}>
                      {stats.contributionRatio > 1 
                        ? `${Math.round((stats.contributionRatio - 1) * 100)}% above average`
                        : `${Math.round((1 - stats.contributionRatio) * 100)}% below average`
                      }
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}