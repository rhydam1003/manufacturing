import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { 
  dashboardAPI, 
  productsAPI, 
  inventoryAPI, 
  manufacturingOrdersAPI, 
  workOrdersAPI, 
  workCentersAPI, 
  bomAPI 
} from '@/api';

const APIConnectionTest = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testAPIs = async () => {
    setTesting(true);
    const results = {};

    const apis = [
      { name: 'Dashboard Stats', api: () => dashboardAPI.getStats() },
      { name: 'Products', api: () => productsAPI.getAll() },
      { name: 'Inventory', api: () => inventoryAPI.getLevels() },
      { name: 'Manufacturing Orders', api: () => manufacturingOrdersAPI.getAll() },
      { name: 'Work Orders', api: () => workOrdersAPI.getAll() },
      { name: 'Work Centers', api: () => workCentersAPI.getAll() },
      { name: 'BOMs', api: () => bomAPI.getAll() },
    ];

    for (const { name, api } of apis) {
      try {
        console.log(`Testing ${name}...`);
        const response = await api();
        results[name] = { 
          status: 'success', 
          data: response,
          message: 'Connected successfully' 
        };
        console.log(`${name} success:`, response);
      } catch (error) {
        results[name] = { 
          status: 'error', 
          error: error.message,
          message: `Failed: ${error.message}` 
        };
        console.error(`${name} error:`, error);
      }
    }

    setTestResults(results);
    setTesting(false);
  };

  useEffect(() => {
    testAPIs();
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    return <Loader2 className="h-4 w-4 animate-spin" />;
  };

  const getStatusBadge = (status) => {
    if (status === 'success') return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
    if (status === 'error') return <Badge variant="destructive">Failed</Badge>;
    return <Badge variant="outline">Testing...</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Connection Test</h1>
          <p className="text-muted-foreground mt-1">
            Test all API endpoints to ensure proper backend connectivity
          </p>
        </div>
        <Button onClick={testAPIs} disabled={testing}>
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Retest All APIs'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(testResults).map(([name, result]) => (
          <Card key={name}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{name}</CardTitle>
                {getStatusIcon(result.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(result.status)}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Message:</span>
                  <p className="mt-1">{result.message}</p>
                </div>
                {result.data && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Data Type:</span>
                    <p className="mt-1 font-mono text-xs">
                      {Array.isArray(result.data) 
                        ? `Array (${result.data.length} items)` 
                        : typeof result.data}
                    </p>
                  </div>
                )}
                {result.error && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Error:</span>
                    <p className="mt-1 text-red-600 font-mono text-xs">{result.error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
          <CardDescription>
            Overview of API connectivity status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(testResults).filter(r => r.status === 'success').length}
              </div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(testResults).filter(r => r.status === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIConnectionTest;
