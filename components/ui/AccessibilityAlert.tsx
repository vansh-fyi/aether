import React from 'react';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { AlertTriangleIcon, CheckCircleIcon } from '../icons/SimpleIcons';
import { ContrastResult } from '../../utils/accessibility';

interface AccessibilityAlertProps {
  contrastResult: ContrastResult;
  colorName: string;
  foreground: string;
  background: string;
  className?: string;
}

export function AccessibilityAlert({ 
  contrastResult, 
  colorName, 
  foreground, 
  background,
  className 
}: AccessibilityAlertProps) {
  const { ratio, passes, level } = contrastResult;
  
  const getIcon = () => {
    if (level === 'AAA') return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
    if (level === 'AA') return <CheckCircleIcon className="h-4 w-4 text-blue-600" />;
    return <AlertTriangleIcon className="h-4 w-4 text-red-600" />;
  };
  
  const getVariant = () => {
    if (level === 'FAIL') return 'destructive';
    return 'default';
  };
  
  const getMessage = () => {
    if (level === 'AAA') {
      return `Excellent contrast ratio (${ratio.toFixed(1)}:1). Meets AAA standards.`;
    } else if (level === 'AA') {
      return `Good contrast ratio (${ratio.toFixed(1)}:1). Meets AA standards.`;
    } else {
      return `Poor contrast ratio (${ratio.toFixed(1)}:1). Fails accessibility standards. Consider using a darker color.`;
    }
  };

  return (
    <Alert variant={getVariant()} className={className}>
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm capitalize">{colorName}</span>
            <Badge variant={passes ? 'default' : 'destructive'} className="text-xs">
              {level}
            </Badge>
          </div>
          <AlertDescription className="text-xs">
            {getMessage()}
          </AlertDescription>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded border" 
                style={{ backgroundColor: foreground }}
              />
              <span className="text-xs text-muted-foreground">on</span>
              <div 
                className="w-3 h-3 rounded border" 
                style={{ backgroundColor: background }}
              />
            </div>
          </div>
        </div>
      </div>
    </Alert>
  );
}