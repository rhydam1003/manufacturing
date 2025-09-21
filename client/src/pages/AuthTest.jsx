import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { authAPI } from '@/api/auth';

const AuthTest = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);
  const [credentials, setCredentials] = useState({
    email: 'admin@example.com',
    password: 'admin123'
  });

  const testLogin = async () => {
    setTesting(true);
    try {
      console.log('Testing login with:', credentials);
      const response = await authAPI.login(credentials);
      console.log('Login response:', response);
      
      setTestResults({
        status: 'success',
        message: 'Login successful!',
        data: response
      });
    } catch (error) {
      console.error('Login test failed:', error);
      setTestResults({
        status: 'error',
        message: error.message || 'Login failed',
        error: error
      });
    } finally {
      setTesting(false);
    }
  };

  const testRegister = async () => {
    setTesting(true);
    try {
      const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        role: 'Operator'
      };
      
      console.log('Testing register with:', testUser);
      const response = await authAPI.register(testUser);
      console.log('Register response:', response);
      
      setTestResults({
        status: 'success',
        message: 'Registration successful!',
        data: response
      });
    } catch (error) {
      console.error('Register test failed:', error);
      setTestResults({
        status: 'error',
        message: error.message || 'Registration failed',
        error: error
      });
    } finally {
      setTesting(false);
    }
  };

  const testCurrentUser = async () => {
    setTesting(true);
    try {
      console.log('Testing getCurrentUser...');
      const response = await authAPI.getCurrentUser();
      console.log('Current user response:', response);
      
      setTestResults({
        status: 'success',
        message: 'Get current user successful!',
        data: response
      });
    } catch (error) {
      console.error('Get current user test failed:', error);
      setTestResults({
        status: 'error',
        message: error.message || 'Get current user failed',
        error: error
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Authentication Test</h1>
        <p className="text-muted-foreground mt-1">
          Test login, register, and authentication endpoints
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Credentials</CardTitle>
            <CardDescription>
              Enter credentials to test login functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={testLogin} disabled={testing} className="flex-1">
                {testing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Login'
                )}
              </Button>
              <Button onClick={testRegister} disabled={testing} variant="outline">
                Test Register
              </Button>
            </div>
            <Button onClick={testCurrentUser} disabled={testing} variant="outline" className="w-full">
              Test Get Current User
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Results from the latest test
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(testResults).length === 0 ? (
              <p className="text-muted-foreground">No tests run yet</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {testResults.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">{testResults.message}</span>
                </div>
                
                {testResults.data && (
                  <div className="space-y-2">
                    <Label>Response Data:</Label>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(testResults.data, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResults.error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <strong>Error:</strong> {testResults.error.message}
                      {testResults.error.response?.data && (
                        <pre className="mt-2 text-xs">
                          {JSON.stringify(testResults.error.response.data, null, 2)}
                        </pre>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTest;
