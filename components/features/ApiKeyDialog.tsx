import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { ExternalLink, Key, AlertTriangle, Info } from 'lucide-react';
import { validateApiKey, getApiKeyUrl } from '../../services/geminiClient';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySubmit: (apiKey: string) => void;
  onSkip: () => void;
}

export function ApiKeyDialog({ open, onOpenChange, onApiKeySubmit, onSkip }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [validation, setValidation] = useState<{ valid: boolean; message: string }>({ valid: true, message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = validateApiKey(apiKey);
    setValidation(validationResult);
    
    if (validationResult.valid) {
      onApiKeySubmit(apiKey);
      onOpenChange(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    
    // Clear validation error when user starts typing
    if (!validation.valid && value.length > 0) {
      setValidation({ valid: true, message: '' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Required
          </DialogTitle>
          <DialogDescription>
            To use AI-powered design generation, please provide your Google AI API key or skip to use pre-defined personas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Security Notice */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Demo Notice:</strong> For this Makeathon demo, API keys are handled client-side. 
              In production, this would use secure server-side processing.
            </AlertDescription>
          </Alert>

          {/* API Key Instructions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key">Google AI API Key</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(getApiKeyUrl(), '_blank')}
                className="text-xs flex items-center gap-1"
              >
                Get API Key
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Google AI API key..."
                value={apiKey}
                onChange={handleApiKeyChange}
                className={!validation.valid ? 'border-red-500' : ''}
              />
              
              {!validation.valid && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {validation.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={!apiKey}>
                  Use API Key
                </Button>
                <Button type="button" variant="outline" onClick={handleSkip} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none">
                  Use Aether's model
                </Button>
              </div>
            </form>
          </div>

          {/* Information Panel */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>How to get an API key:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-xs">
                <li>Visit Google AI Studio (link above)</li>
                <li>Sign in with your Google account</li>
                <li>Create a new API key</li>
                <li>Copy and paste it here</li>
              </ol>
              <p className="mt-2 text-xs">
                Skipping will use pre-defined design personas instead of AI analysis.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}