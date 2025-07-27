import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

export default function ApiKeyInput({ onApiKeySet }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setIsValid(false);
      return;
    }

    if (!apiKey.startsWith('hf_')) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
    onApiKeySet(apiKey.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Key className="w-12 h-12 text-educational-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Hugging Face Token Required</h1>
          <p className="text-muted-foreground">
            To generate personalized quizzes and recommendations, please provide your Hugging Face token.
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> Your token is only stored temporarily in your browser for this session. 
            It's not saved permanently or sent to any external servers except Hugging Face.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enter Hugging Face Token</CardTitle>
            <CardDescription>
              You can get your token from the Hugging Face platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="apiKey">Hugging Face Token</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="hf_..."
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setIsValid(true);
                  }}
                  className={`mt-1 ${!isValid ? 'border-destructive' : ''}`}
                />
                {!isValid && (
                  <p className="text-sm text-destructive mt-1">
                    Please enter a valid Hugging Face token (starts with 'hf_')
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" variant="educational">
                Continue to Assessment
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open('https://huggingface.co/settings/tokens', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Hugging Face Token
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            This is a demonstration app. In production, tokens would be handled securely on the backend.
          </p>
        </div>
      </div>
    </div>
  );
}