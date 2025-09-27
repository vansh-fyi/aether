import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ColorPalette } from '../../store/useDesignSystemStore';
import { generateColorRamp } from '../../engine/AetherGenerator';

interface ColorPickerProps {
  colorKey: keyof ColorPalette;
  colorValue: string;
  colorLabel: string;
  onColorChange: (colorKey: keyof ColorPalette, value: string) => void;
}

export function ColorPicker({ colorKey, colorValue, colorLabel, onColorChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(colorValue);
  const [showRamp, setShowRamp] = useState(false);

  // Syncs the input field if the color is changed elsewhere (e.g., undo)
  useEffect(() => {
    setInputValue(colorValue);
  }, [colorValue]);

  const handleColorChange = (newColor: string) => {
    setInputValue(newColor);
    onColorChange(colorKey, newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onColorChange(colorKey, value);
    }
  };

  const colorRamp = generateColorRamp(colorValue);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="h-10 w-10 rounded-md border border-border shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: colorValue }}
              aria-label={`Pick ${colorLabel} color`}
            />
          </PopoverTrigger>
          {/* CHANGE 1: Added card styling to the PopoverContent */}
          <PopoverContent className="w-80 rounded-lg border bg-card p-4 text-card-foreground shadow-soft">
            <div className="space-y-4">
              <Label className="text-sm font-medium capitalize">{colorLabel}</Label>

              <div className="space-y-2">
                <Label htmlFor={`${colorKey}-hex`} className="text-xs text-muted-foreground">
                  Hex Color
                </Label>
                {/* CHANGE 2: Added standard input styling */}
                <Input
                  id={`${colorKey}-hex`}
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="#000000"
                  className="font-mono border-border bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${colorKey}-picker`} className="text-xs text-muted-foreground">
                  Color Picker
                </Label>
                <input
                  id={`${colorKey}-picker`}
                  type="color"
                  value={colorValue}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="h-10 w-full cursor-pointer rounded border border-border"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Color Ramp</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRamp(!showRamp)}
                    className="h-6 px-2 text-xs"
                  >
                    {showRamp ? 'Hide' : 'Show'}
                  </Button>
                </div>

                {showRamp && (
                  <div className="grid grid-cols-5 gap-1">
                    {Object.entries(colorRamp).map(([step, color]) => (
                      <div key={step} className="space-y-1">
                        <div
                          className="h-8 w-full rounded border border-border"
                          style={{ backgroundColor: color }}
                        />
                        <div className="text-center text-xs text-muted-foreground">
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium capitalize">{colorLabel}</Label>
            <span className="font-mono text-xs text-muted-foreground">{colorValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}