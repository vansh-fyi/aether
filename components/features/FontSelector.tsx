import React, { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { FONT_COMBINATIONS, TYPOGRAPHY_SCALES } from '../../engine/AetherGenerator';
import { TypographyTokens } from '../../store/useDesignSystemStore';

interface FontSelectorProps {
  currentHeadingFont: string;
  currentBodyFont: string;
  currentScale: TypographyTokens['scale'];
  currentBaseFontSizeDesktop?: number;
  currentBaseFontSizeMobile?: number;
  originalHeadingFont?: string;
  originalBodyFont?: string;
  onFontChange: (headingFont: string, bodyFont: string) => void;
  onScaleChange: (scale: TypographyTokens['scale'], baseFontSizeDesktop?: number, baseFontSizeMobile?: number) => void;
}

export function FontSelector({
  currentHeadingFont,
  currentBodyFont,
  currentScale,
  currentBaseFontSizeDesktop,
  currentBaseFontSizeMobile,
  originalHeadingFont,
  originalBodyFont,
  onFontChange,
  onScaleChange,
}: FontSelectorProps) {
  const [desktopSize, setDesktopSize] = useState(currentBaseFontSizeDesktop || 16);
  const [mobileSize, setMobileSize] = useState(currentBaseFontSizeMobile || 14);
  const [desktopDisplayValue, setDesktopDisplayValue] = useState((currentBaseFontSizeDesktop || 16).toString());
  const [mobileDisplayValue, setMobileDisplayValue] = useState((currentBaseFontSizeMobile || 14).toString());
  const [selectedCombination, setSelectedCombination] = useState(() => FONT_COMBINATIONS.find(combo => combo.heading === currentHeadingFont && combo.body === currentBodyFont)?.id || 'custom');
  const [storedOriginalFonts] = useState({ heading: originalHeadingFont || currentHeadingFont, body: originalBodyFont || currentBodyFont });

  useEffect(() => {
    const newDesktop = currentBaseFontSizeDesktop || 16;
    const newMobile = currentBaseFontSizeMobile || 14;
    setDesktopSize(newDesktop);
    setMobileSize(newMobile);
    setDesktopDisplayValue(newDesktop.toString());
    setMobileDisplayValue(newMobile.toString());
  }, [currentBaseFontSizeDesktop, currentBaseFontSizeMobile]);

  const handleCombinationChange = (combinationId: string) => {
    setSelectedCombination(combinationId);
    if (combinationId === 'custom') {
      onFontChange(storedOriginalFonts.heading, storedOriginalFonts.body);
    } else {
      const combination = FONT_COMBINATIONS.find(combo => combo.id === combinationId);
      if (combination) {
        onFontChange(combination.heading, combination.body);
      }
    }
  };

  const handleScaleChange = (scale: TypographyTokens['scale']) => { onScaleChange(scale, desktopSize, mobileSize); };
  const handleBaseSizeChange = (desktop: number, mobile: number) => { onScaleChange(currentScale, desktop, mobile); };

  const groupedFonts = FONT_COMBINATIONS.reduce((groups, font) => {
    const category = font.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(font);
    return groups;
  }, {} as Record<string, typeof FONT_COMBINATIONS[number][]>);

  const getCategoryLabel = (category: string) => ({ 'sans-serif': 'Sans Serif', 'serif': 'Serif', 'display': 'Display', 'decorative': 'Decorative', 'slab-serif': 'Slab Serif' }[category] || category);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Font Combination</Label>
        <Select value={selectedCombination} onValueChange={handleCombinationChange}>
          {/* CHANGE 1: Added standard input styling to the trigger */}
          <SelectTrigger className="border-border bg-background">
            <SelectValue placeholder="Choose a font combination" />
          </SelectTrigger>
          {/* CHANGE 2: Added popover/card styling to the content dropdown */}
          <SelectContent className="border-border bg-card text-card-foreground shadow-soft">
            {Object.entries(groupedFonts).map(([category, fonts]) => (
              <React.Fragment key={category}>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">{getCategoryLabel(category)}</div>
                {fonts.map((font) => (
                  <SelectItem key={font.id} value={font.id}>
                    <div className="flex items-center gap-2">
                      <span>{font.name}</span>
                      <Badge variant="outline" className="text-xs">{getCategoryLabel(font.category)}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </React.Fragment>
            ))}
            <SelectItem value="custom">
              <div className="flex items-center gap-2">
                <span>Original Selection</span>
                <Badge variant="secondary" className="text-xs">Custom</Badge>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-4 space-y-4 bg-background border-border">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Preview</Label>
          <div className="space-y-3">
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Heading Font</div>
              <h3 className="text-lg font-semibold" style={{ fontFamily: currentHeadingFont }}>The quick brown fox jumps over the lazy dog</h3>
              <div className="mt-1 font-mono text-xs text-muted-foreground">{currentHeadingFont.split(',')[0]}</div>
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Body Font</div>
              <p className="text-sm" style={{ fontFamily: currentBodyFont }}>The quick brown fox jumps over the lazy dog. This is a sample of body text to show how the font looks in paragraph form.</p>
              <div className="mt-1 font-mono text-xs text-muted-foreground">{currentBodyFont.split(',')[0]}</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Base Font Sizes</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="desktop-size" className="text-xs text-muted-foreground">Desktop (px)</Label>
            {/* CHANGE 3: Added standard input styling */}
            <Input id="desktop-size" type="number" value={desktopDisplayValue} onChange={(e) => { const val = e.target.value; setDesktopDisplayValue(val); const num = parseInt(val); if (!isNaN(num) && num >= 8 && num <= 24) handleBaseSizeChange(num, mobileSize); }} min="8" max="24" className="border-border bg-background text-center" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile-size" className="text-xs text-muted-foreground">Mobile (px)</Label>
            {/* CHANGE 4: Added standard input styling */}
            <Input id="mobile-size" type="number" value={mobileDisplayValue} onChange={(e) => { const val = e.target.value; setMobileDisplayValue(val); const num = parseInt(val); if (!isNaN(num) && num >= 8 && num <= 20) handleBaseSizeChange(desktopSize, num); }} min="8" max="20" className="border-border bg-background text-center" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Typography Scale</Label>
        <Select value={currentScale} onValueChange={handleScaleChange}>
          {/* CHANGE 5: Added standard input styling to the trigger */}
          <SelectTrigger className="border-border bg-background">
            <SelectValue />
          </SelectTrigger>
          {/* CHANGE 6: Added popover/card styling to the content dropdown */}
          <SelectContent className="border-border bg-card text-card-foreground shadow-soft">
            {Object.entries(TYPOGRAPHY_SCALES).map(([scale, ratio]) => (
              <SelectItem key={scale} value={scale}>
                <div className="flex w-full items-center justify-between">
                  <span className="capitalize">{scale.replace('-', ' ')}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{ratio.toFixed(3)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}