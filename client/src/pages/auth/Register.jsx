import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Factory } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const { register, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: '',
      }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value,
    }));
    if (errors.role) {
      setErrors(prev => ({
        ...prev,
        role: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...submitData } = formData;

    try {
      // Fetch roles from backend to get ObjectId for selected role
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/v1/roles');
      const data = await res.json();
      const found = data.roles?.find((r) => r.name === formData.role);
      
      const result = await register({
        ...submitData,
        role: found?._id || formData.role // fallback to role name if id not found
      });
    
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Registration failed. Please try again.'
      }));
    }
  };

    // These must match the seeded role names and be replaced with their ObjectIds after fetching from backend
    const roles = [
      { value: 'Admin', label: 'Business Owner / Admin' },
      { value: 'Manager', label: 'Manufacturing Manager' },
      { value: 'Operator', label: 'Operator / Shop-floor Worker' },
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-industrial border-border/50">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-xl industrial-gradient flex items-center justify-center">
              <Factory className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Join the Manufacturing Management System
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="smooth-transition"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="smooth-transition"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="smooth-transition"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="smooth-transition"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full industrial-gradient hover:shadow-industrial smooth-transition"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-hover font-medium smooth-transition"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;