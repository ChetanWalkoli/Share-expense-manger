import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, Users, Calendar, Trash2, Edit } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Group {
  id: string;
  name: string;
  description: string;
  duration: number;
  durationType: 'days' | 'months' | 'years';
  members: string[];
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'expired';
}

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Bali Trip 2024',
    description: 'Expenses for our amazing Bali vacation',
    duration: 7,
    durationType: 'days',
    members: ['john@example.com', 'jane@example.com', 'mike@example.com'],
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-01-22'),
    status: 'expired'
  },
  {
    id: '2',
    name: 'Roommate Bills',
    description: 'Shared apartment expenses and utilities',
    duration: 2,
    durationType: 'years',
    members: ['alex@example.com', 'sarah@example.com'],
    createdAt: new Date('2024-01-01'),
    expiresAt: new Date('2026-01-01'),
    status: 'active'
  }
];

export function CreateGroup() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    durationType: 'days' as 'days' | 'months' | 'years',
    members: ['']
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMemberField = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, '']
    }));
  };

  const removeMemberField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const updateMember = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => i === index ? value : member)
    }));
  };

  const calculateExpiryDate = (duration: number, type: 'days' | 'months' | 'years') => {
    const now = new Date();
    switch (type) {
      case 'days':
        return new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
      case 'months':
        return new Date(now.setMonth(now.getMonth() + duration));
      case 'years':
        return new Date(now.setFullYear(now.getFullYear() + duration));
      default:
        return new Date();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.duration) {
      toast.error("Please fill in all required fields");
      return;
    }

    const duration = parseInt(formData.duration);
    const expiresAt = calculateExpiryDate(duration, formData.durationType);
    const validMembers = formData.members.filter(member => member.trim() !== '');

    const newGroup: Group = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      duration,
      durationType: formData.durationType,
      members: validMembers,
      createdAt: new Date(),
      expiresAt,
      status: 'active'
    };

    setGroups(prev => [newGroup, ...prev]);
    setFormData({
      name: '',
      description: '',
      duration: '',
      durationType: 'days',
      members: ['']
    });
    setShowForm(false);
    
    toast.success(`Group "${newGroup.name}" created successfully!`);
  };

  const deleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(group => group.id !== groupId));
    toast.success("Group deleted successfully");
  };

  const getDaysRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Create Groups</h1>
          <p className="text-muted-foreground">
            Create expense groups with time limits for trips, roommates, or any shared expenses.
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Group
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
            <CardDescription>
              Set up a new expense sharing group with automatic expiry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Bali Trip 2024"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="3"
                      min="1"
                      required
                      className="flex-1"
                    />
                    <Select 
                      value={formData.durationType} 
                      onValueChange={(value: 'days' | 'months' | 'years') => 
                        handleInputChange('durationType', value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the group purpose"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Group Members</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addMemberField}
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Member
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.members.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={member}
                        onChange={(e) => updateMember(index, e.target.value)}
                        placeholder="member@example.com"
                        type="email"
                        className="flex-1"
                      />
                      {formData.members.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeMemberField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Group</Button>
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

      <div className="grid gap-4">
        <h2>Your Groups</h2>
        {groups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3>No groups yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first expense sharing group to get started
              </p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
              const daysRemaining = getDaysRemaining(group.expiresAt);
              const isExpired = group.status === 'expired' || daysRemaining < 0;
              
              return (
                <Card key={group.id} className={isExpired ? 'opacity-75' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={isExpired ? 'destructive' : 'default'}>
                            {isExpired ? 'Expired' : 'Active'}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            {isExpired ? 'Expired' : `${daysRemaining} days left`}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteGroup(group.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {group.description && (
                      <p className="text-sm text-muted-foreground">
                        {group.description}
                      </p>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{group.members.length} members</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {group.members.slice(0, 3).map((member, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {member.split('@')[0]}
                          </Badge>
                        ))}
                        {group.members.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{group.members.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Created: {group.createdAt.toLocaleDateString()}
                      <br />
                      Expires: {group.expiresAt.toLocaleDateString()}
                    </div>
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