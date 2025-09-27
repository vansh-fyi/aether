import React, { useCallback } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

import {
  PaletteIcon,
  ZapIcon,
  ShuffleIcon,
  SparklesIcon,
  ImagesIcon,
} from '../icons/SimpleIcons';

const PERSONAS = [
  { id: 'minimal', name: 'Minimal', description: 'Clean, simple, and uncluttered', preview: { primary: '#000000', accent: '#f5f5f5', style: 'geometric' } },
  { id: 'modern', name: 'Modern', description: 'Contemporary with bold typography', preview: { primary: '#2563eb', accent: '#f1f5f9', style: 'tech' } },
  { id: 'playful', name: 'Playful', description: 'Vibrant colors and rounded edges', preview: { primary: '#ec4899', accent: '#fef3f2', style: 'rounded' } },
  { id: 'corporate', name: 'Corporate', description: 'Professional and trustworthy', preview: { primary: '#1e40af', accent: '#f8fafc', style: 'formal' } },
  { id: 'creative', name: 'Creative', description: 'Artistic and experimental', preview: { primary: '#7c3aed', accent: '#faf5ff', style: 'artistic' } },
  { id: 'warm', name: 'Warm', description: 'Earthy tones and organic feel', preview: { primary: '#ea580c', accent: '#fff7ed', style: 'organic' } },
];

const MAX_VISION_IMAGES = 3;

export function InputStateComponent() {
  const {
    visionImages,
    addVisionImage,
    removeVisionImage,
    selectedPersona,
    setSelectedPersona,
    setCurrentStep,
    setGenerationMethod,
  } = useDesignSystemStore();

  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => file.type === 'image/jpeg' || file.type === 'image/png');
    const availableSlots = MAX_VISION_IMAGES - visionImages.length;
    const filesToAdd = validFiles.slice(0, availableSlots);
    filesToAdd.forEach(file => addVisionImage(file));
    event.target.value = '';
  }, [visionImages.length, addVisionImage]);

  const handlePersonaSelect = useCallback((personaId: string) => {
    setSelectedPersona(selectedPersona === personaId ? null : personaId);
  }, [selectedPersona, setSelectedPersona]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => file.type === 'image/jpeg' || file.type === 'image/png');
    const availableSlots = MAX_VISION_IMAGES - visionImages.length;
    const filesToAdd = validFiles.slice(0, availableSlots);
    filesToAdd.forEach(file => addVisionImage(file));
  }, [visionImages.length, addVisionImage]);

  const handleVisionGeneration = () => { if (visionImages.length > 0) { setGenerationMethod('vision'); setCurrentStep('generator'); } };
  const handlePersonaGeneration = () => { if (selectedPersona) { setGenerationMethod('persona'); setCurrentStep('generator'); } };
  const handleChaosGeneration = () => { setGenerationMethod('chaos'); setCurrentStep('generator'); };

  const canGenerateWithVision = visionImages.length > 0;
  const canGenerateWithPersona = selectedPersona !== null;

  return (
    <main className="px-6 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Aether Design System Generator</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Create a complete design system. Choose your generation method to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">

          {/* Method 1: Upload Your Vision */}
          <div className="rounded-xl border bg-gradient-card p-6 text-card-foreground shadow-soft transition-all hover:shadow-medium hover:-translate-y-0.5">
            <div className="flex h-full flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-vision p-2">
                  <SparklesIcon className="h-6 w-6 text-vision-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Upload Your Vision</h3>
                  <p className="text-sm text-muted-foreground">AI analyzes your images</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">It can be a moodboard, images you like, or screenshots that inspire your idea.</p>

              {/* This new container will grow and scroll, keeping the button at the bottom */}
              <div className="flex-grow space-y-4 overflow-y-auto min-h-0">
                <div
                  className={cn("rounded-lg border-2 border-dashed p-6 text-center flex-grow space-y-4 overflow-y-auto min-h-0 transition-colors", isDragOver ? "border-primary bg-primary/5" : "border-border")}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <ImagesIcon className={cn("mx-auto h-8 w-8", isDragOver ? 'text-primary' : 'text-muted-foreground')} />
                  <div>
                    <p className="text-sm font-medium">Drop images here</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG • Max {MAX_VISION_IMAGES} files</p>
                  </div>
                  <input id="vision-upload-main" type="file" accept=".jpg,.jpeg,.png" multiple onChange={handleFileUpload} className="hidden" />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('vision-upload-main')?.click()}>Browse Files</Button>
                </div>

                {visionImages.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex overflow-x-auto gap-2 pt-2">
                      <div className="flex-shrink-0 w-full min-w-full">
                        <div className="flex gap-2">
                          {visionImages.map((image, index) => (
                            <div key={index} className="relative group flex-shrink-0">
                              <img src={URL.createObjectURL(image)} alt={`Vision ${index + 1}`} className="h-16 w-16 rounded border object-cover shadow-sm" />
                              <button type="button" onClick={() => removeVisionImage(index)} className="absolute -top-2 -right-2 z-10 h-5 w-5 opacity-0 transition-all group-hover:opacity-100 hover:scale-110" aria-label="Remove image">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#ef4444" /><path d="M8 8L16 16M16 8L8 16" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleVisionGeneration} disabled={!canGenerateWithVision} size="lg" className="mt-auto w-full gap-2 bg-gradient-primary text-primary-foreground shadow-soft transition-all hover:-translate-y-px hover:shadow-medium">
                <SparklesIcon className="h-4 w-4" />
                Generate with AI
              </Button>
            </div>
          </div>

          {/* Method 2: Choose Style Direction */}
          <div className="card-enhanced">
            <div className="flex h-full flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-color_foreground p-2">
                  <PaletteIcon className="h-6 w-6 text-primary-color" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Choose Style Direction</h3>
                  <p className="text-sm text-muted-foreground">Pick from curated templates</p>
                </div>
              </div>

              {/* This is the corrected line with max-height */}
              <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '400px' }}>
                {PERSONAS.map((persona) => (
                  <div
                    key={persona.id}
                    className={cn('cursor-pointer rounded-lg border p-3 transition-all', selectedPersona === persona.id ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground')}
                    onClick={() => handlePersonaSelect(persona.id)}
                  >
                    {/* ... Persona details ... */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{persona.name}</h4>
                        {selectedPersona === persona.id && <Badge>Selected</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{persona.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: persona.preview.primary }} />
                          <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: persona.preview.accent }} />
                        </div>
                        <span className="text-xs capitalize text-muted-foreground">{persona.preview.style}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePersonaGeneration}
                disabled={!canGenerateWithPersona}
                className="btn btn-primary mt-auto w-full gap-2"
              >
                <PaletteIcon className="h-4 w-4" />
                Use Selected Style
              </button>
            </div>
          </div>

          {/* Method 3: Chaos Mode */}
          <div className="rounded-xl border bg-gradient-card p-6 text-card-foreground shadow-soft transition-all hover:shadow-medium hover:-translate-y-0.5">
            <div className="flex h-full flex-col space-y-4">
              <div className="flex items-center gap-3"><div className="rounded-lg bg-chaos p-2"><ZapIcon className="h-6 w-6 text-chaos-foreground" /></div><div><h3 className="text-lg font-semibold">Chaos Mode</h3><p className="text-sm text-muted-foreground">Experimental combinations</p></div></div>
              <div className="relative flex-grow flex flex-col justify-center rounded-2xl border-2 border-dashed border-purple-300 bg-gradient-to-br from-pink-50 to-purple-50 p-6 text-center shadow-soft"><div className="relative space-y-2"><SparklesIcon className="mx-auto h-10 w-10 text-pink-500" /><div><h4 className="font-medium">Embrace the Unexpected</h4><p className="text-sm text-muted-foreground">Let AI surprise you with bold, experimental designs.</p></div><div className="flex justify-center gap-2 pt-2"><div className="h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" /><div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400" /><div className="h-3 w-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500" /></div><div className="space-y-1 pt-2 text-xs text-muted-foreground"><p>• Unconventional palettes</p><p>• Experimental typography</p><p>• Unexpected patterns</p></div></div></div>
              <Button onClick={handleChaosGeneration} size="lg" className="mt-auto w-full gap-2 bg-gradient-secondary text-white shadow-soft transition-all hover:-translate-y-px hover:shadow-medium"><ShuffleIcon className="h-4 w-4" />Unleash Chaos</Button>
            </div>
          </div>
        </div>

        <div className="text-center"><p className="text-sm text-muted-foreground">Choose one generation method to create your design system</p></div>
      </div>
    </main>
  );
}