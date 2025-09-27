import React, { useEffect, useState } from "react";
import { useDesignSystemStore } from "../../store/useDesignSystemStore";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  PaletteIcon,
  TypeIcon,
  ComponentIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  SmartphoneIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from "../icons/SimpleIcons";
import {
  generateDesignSystem,
  filesToBase64,
} from "../../services/geminiClient";
import { validateDesignSystemColors } from "../../utils/accessibility";
import { AccessibilityAlert } from "../ui/AccessibilityAlert";

import { ColorPicker } from "./ColorPicker";
import { FontSelector } from "./FontSelector";

const CONTROLS = [
  {
    id: "color",
    label: "Colors",
    icon: PaletteIcon,
    description: "Primary, secondary, and accent colors",
  },
  {
    id: "typography",
    label: "Typography",
    icon: TypeIcon,
    description: "Font families and sizes",
  },
  {
    id: "components",
    label: "Components",
    icon: ComponentIcon,
    description: "UI component styles",
  },
] as const;

const personaConfigs = {
  minimal: {
    colors: {
      primary: "#000000",
      secondary: "#666666",
      success: "#00C851",
      error: "#ff4444",
      warning: "#ffbb33",
      accent: "#f5f5f5",
      neutral: "#999999",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      baseFontSizeDesktop: 16,
      baseFontSizeMobile: 14,
      scale: "minor-third",
      fontSize: {
        xs: "0.694rem",
        sm: "0.833rem",
        base: "1rem",
        lg: "1.2rem",
        xl: "1.44rem",
        "2xl": "1.728rem",
        "3xl": "2.074rem",
        "4xl": "2.488rem",
      },
    },
  },
  modern: {
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      accent: "#f1f5f9",
      neutral: "#475569",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      baseFontSizeDesktop: 16,
      baseFontSizeMobile: 14,
      scale: "major-third",
      fontSize: {
        xs: "0.64rem",
        sm: "0.8rem",
        base: "1rem",
        lg: "1.25rem",
        xl: "1.563rem",
        "2xl": "1.953rem",
        "3xl": "2.441rem",
        "4xl": "3.052rem",
      },
    },
  },
  playful: {
    colors: {
      primary: "#ec4899",
      secondary: "#8b5cf6",
      success: "#10b981",
      error: "#f87171",
      warning: "#fbbf24",
      accent: "#fef3f2",
      neutral: "#6b7280",
    },
    typography: {
      headingFont: "Poppins, system-ui, sans-serif",
      bodyFont: "Poppins, system-ui, sans-serif",
      baseFontSizeDesktop: 16,
      baseFontSizeMobile: 14,
      scale: "major-third",
      fontSize: {
        xs: "0.64rem",
        sm: "0.8rem",
        base: "1rem",
        lg: "1.25rem",
        xl: "1.563rem",
        "2xl": "1.953rem",
        "3xl": "2.441rem",
        "4xl": "3.052rem",
      },
    },
  },
  corporate: {
    colors: {
      primary: "#1e40af",
      secondary: "#374151",
      success: "#059669",
      error: "#dc2626",
      warning: "#d97706",
      accent: "#f8fafc",
      neutral: "#4b5563",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      baseFontSizeDesktop: 16,
      baseFontSizeMobile: 14,
      scale: "major-third",
      fontSize: {
        xs: "0.64rem",
        sm: "0.8rem",
        base: "1rem",
        lg: "1.25rem",
        xl: "1.563rem",
        "2xl": "1.953rem",
        "3xl": "2.441rem",
        "4xl": "3.052rem",
      },
    },
  },
  creative: {
    colors: {
      primary: "#7c3aed",
      secondary: "#059669",
      success: "#10b981",
      error: "#f87171",
      warning: "#fbbf24",
      accent: "#faf5ff",
      neutral: "#6b7280",
    },
    typography: {
      headingFont: "Playfair Display, serif",
      bodyFont: "Inter, system-ui, sans-serif",
      baseFontSizeDesktop: 16,
      baseFontSizeMobile: 14,
      scale: "major-third",
      fontSize: {
        xs: "0.64rem",
        sm: "0.8rem",
        base: "1rem",
        lg: "1.25rem",
        xl: "1.563rem",
        "2xl": "1.953rem",
        "3xl": "2.441rem",
        "4xl": "3.052rem",
      },
    },
  },
  warm: {
    colors: {
      primary: "#ea580c",
      secondary: "#dc2626",
      success: "#16a34a",
      error: "#dc2626",
      warning: "#ca8a04",
      accent: "#fff7ed",
      neutral: "#78716c",
    },
    typography: {
      headingFont: "Merriweather, serif",
      bodyFont: "Source Sans Pro, system-ui, sans-serif",
      baseFontSizeDesktop: 16,
      baseFontSizeMobile: 14,
      scale: "major-third",
      fontSize: {
        xs: "0.64rem",
        sm: "0.8rem",
        base: "1rem",
        lg: "1.25rem",
        xl: "1.563rem",
        "2xl": "1.953rem",
        "3xl": "2.441rem",
        "4xl": "3.052rem",
      },
    },
  },
} as const;

function getPersonaDesignTokens(persona: string) {
  return (
    personaConfigs[persona as keyof typeof personaConfigs] ||
    personaConfigs.modern
  );
}

// Typography scale calculations
const TYPOGRAPHY_SCALES = {
  "minor-second": 1.067,
  "major-second": 1.125,
  "minor-third": 1.2,
  "major-third": 1.25,
  "perfect-fourth": 1.333,
  "augmented-fourth": 1.414,
  "perfect-fifth": 1.5,
  "golden-ratio": 1.618,
} as const;

// Font import name helper
const getFontImportName = (fontFamily: string) => {
  const fontName = fontFamily.split(",")[0].trim();
  return fontName.replace(/\s+/g, "+").replace(/['\"]/g, "");
};

// Live Preview Styles Component
const LivePreviewStyles = React.memo(() => {
  const { designTokens, viewportMode } = useDesignSystemStore();
  const styleId = "live-preview-styles";

  useEffect(() => {
    if (!designTokens) return;

    const timeoutId = window.setTimeout(() => {
      let styleTag = document.getElementById(
        styleId,
      ) as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }

      const headingFontName = getFontImportName(
        designTokens.typography.headingFont,
      );
      const bodyFontName = getFontImportName(
        designTokens.typography.bodyFont,
      );

      // Calculate current base font size based on viewport mode
      const currentBaseFontSize =
        viewportMode === "desktop"
          ? designTokens.typography.baseFontSizeDesktop || 16
          : designTokens.typography.baseFontSizeMobile || 14;

      const scaleMultiplier =
        TYPOGRAPHY_SCALES[
          designTokens.typography
            .scale as keyof typeof TYPOGRAPHY_SCALES
        ] || 1.25;

      // Calculate font sizes in pixels based on current base size and scale
      const calculateFontSize = (scaleStep: number) => {
        return (
          Math.pow(scaleMultiplier, scaleStep) *
          currentBaseFontSize
        );
      };

      const css = `
        @import url('https://fonts.googleapis.com/css2?family=${headingFontName}:wght@400;500;600;700&family=${bodyFontName}:wght@400;500;600&display=swap');
        
        .live-preview-container {
          font-size: ${currentBaseFontSize}px;
          --preview-primary: ${designTokens.colors.primary};
          --preview-secondary: ${designTokens.colors.secondary};
          --preview-success: ${designTokens.colors.success};
          --preview-error: ${designTokens.colors.error};
          --preview-warning: ${designTokens.colors.warning};
          --preview-accent: ${designTokens.colors.accent};
          --preview-neutral: ${designTokens.colors.neutral};
          --preview-heading-font: ${designTokens.typography.headingFont};
          --preview-body-font: ${designTokens.typography.bodyFont};
          --preview-font-size-xs: ${calculateFontSize(-2)}px;
          --preview-font-size-sm: ${calculateFontSize(-1)}px;
          --preview-font-size-base: ${calculateFontSize(0)}px;
          --preview-font-size-lg: ${calculateFontSize(1)}px;
          --preview-font-size-xl: ${calculateFontSize(2)}px;
          --preview-font-size-2xl: ${calculateFontSize(3)}px;
          --preview-font-size-3xl: ${calculateFontSize(4)}px;
          --preview-font-size-4xl: ${calculateFontSize(5)}px;
        }
      `;
      styleTag.innerHTML = css;
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, [designTokens, viewportMode]);

  return null;
});

export function GeneratorStateComponent() {
  const {
    generationMethod,
    visionImages,
    selectedPersona,
    apiKey,
    setApiKey,
    hasSkippedApiKey,
    setHasSkippedApiKey,
    designTokens,
    setDesignTokens,
    originalDesignTokens,
    activeControl,
    setActiveControl,
    previewMode,
    setPreviewMode,
    viewportMode,
    setViewportMode,
    setCurrentStep,
    generatedComponents,
    setGeneratedComponents,
    updateColorToken,
    updateTypographyFont,
    updateTypographyScale,
    undoColorChange,
    colorHistory,
    resetStore,
  } = useDesignSystemStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] =
    useState(0);
  const [completedControls, setCompletedControls] = useState<
    string[]
  >([]);


  // Component customization state
  const [componentCustomizations, setComponentCustomizations] =
    useState({
      buttonPaddingX: 24,
      buttonPaddingY: 12,
      buttonFillColor: "primary",
      buttonStrokeColor: "primary",
      cardPadding: 16,
      cardFillColor: "accent",
      cardStrokeColor: "neutral",
      inputPaddingX: 12,
      inputPaddingY: 8,
      inputFillColor: "neutral",
      inputStrokeColor: "neutral",
      navigationFillColor: "primary",
      navigationStrokeColor: "accent",
    });

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  // Keyboard shortcut handling for undo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        if (colorHistory.length > 0) {
          undoColorChange();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [undoColorChange, colorHistory.length]);

  // Effect to clear tokens when generation method changes
  useEffect(() => {
    if (generationMethod && designTokens) {
      setDesignTokens(null);
      setGeneratedComponents([]);
      setActiveControl(null);
      setCompletedControls([]);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }, [generationMethod]);

  // Effect to handle generation when method is set and no tokens exist
  useEffect(() => {
    if (generationMethod && !designTokens && !isGenerating) {
      handleGeneration();
    }
  }, [
    generationMethod,
    designTokens,
    isGenerating,
  ]);

  const handleGeneration = async () => {
    if (!generationMethod) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    let progressInterval: ReturnType<
      typeof setInterval
    > | null = null;

    try {
      progressInterval = setInterval(() => {
        setGenerationProgress((prev) =>
          prev >= 90 ? 90 : prev + 10,
        );
      }, 200);

      let imageBase64s: string[] = [];
      let prompt = "";

      const jsonInstructions = `You MUST return your response as a single, valid JSON object that adheres exactly to this TypeScript interface:
  interface GeminiResponse { 
    designTokens: { 
      colors: { 
        primary: string;   // for buttons and main actions
        secondary: string; // for less important elements
        accent: string;    // for highlights and links
        neutral: string;   // for text and borders
        success: string;
        warning: string;
        error: string;
      }; 
      typography: { 
        headingFont: string; 
        bodyFont: string; 
        baseFontSizeDesktop: number; 
        baseFontSizeMobile: number; 
        scale: 'minor-second' | 'major-second' | 'minor-third' | 'major-third' | 'golden-ratio'; 
      }; 
    };
  }
  Do not include any text, explanation, or markdown formatting like \`\`\`json before or after the JSON object. Your entire output must be only the JSON object itself.`;

      if (generationMethod === "persona" && selectedPersona) {
        const personaTokens =
          getPersonaDesignTokens(selectedPersona);
        const response = {
          designTokens: personaTokens,
          components: [
            "Button",
            "Input",
            "Textarea",
            "Select",
            "Checkbox",
            "Radio",
            "Switch",
            "Card",
            "Badge",
            "Alert",
            "Progress",
            "Avatar",
          ],
        };
        if (progressInterval) clearInterval(progressInterval);
        setGenerationProgress(100);
        setDesignTokens(response.designTokens);
        setGeneratedComponents(response.components);
        setActiveControl("color");
        setIsGenerating(false);
        return;
      }

      if (
        generationMethod === "vision" &&
        visionImages.length > 0
      ) {
        imageBase64s = await filesToBase64(visionImages);
        prompt = `Analyze the attached ${visionImages.length} moodboard image(s). Generate a cohesive design system based on its aesthetic. ${jsonInstructions}`;
      } else if (generationMethod === "chaos") {
        prompt = `You are an experimental AI designer. Generate a "Chaos Mode" design system that is bold, unconventional, and visually striking. ${jsonInstructions}`;
      } else {
        throw new Error(
          "Invalid generation method or missing required data",
        );
      }

      const response = await generateDesignSystem({
        apiKey: apiKey || "AETHER_MODEL",
        imageData: imageBase64s,
        prompt: prompt,
      });

      if (progressInterval) clearInterval(progressInterval);
      setGenerationProgress(100);
      setDesignTokens(response.designTokens);
      setGeneratedComponents(response.components);
      setActiveControl("color");
    } catch (error) {
      console.error(
        "An unexpected error occurred during generation:",
        error,
      );
      if (progressInterval) clearInterval(progressInterval);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleControlClick = (controlId: string) => {
    if (activeControl === controlId) {
      setActiveControl(null);
    } else {
      setActiveControl(
        controlId as "color" | "typography" | "components",
      );
    }
  };

  const handleControlComplete = (controlId: string) => {
    if (!completedControls.includes(controlId)) {
      setCompletedControls([...completedControls, controlId]);
    }
    const currentIndex = CONTROLS.findIndex(
      (c) => c.id === controlId,
    );
    if (currentIndex < CONTROLS.length - 1) {
      setActiveControl(CONTROLS[currentIndex + 1].id);
    } else {
      setActiveControl(null);
    }
  };

  const allControlsCompleted =
    completedControls.length === CONTROLS.length;
  const canProceed = designTokens && allControlsCompleted;



  // Helper function to get color options with swatches
  const getColorOptions = () => {
    if (!designTokens) return [];
    return [
      { name: "primary", color: designTokens.colors.primary },
      {
        name: "secondary",
        color: designTokens.colors.secondary,
      },
      { name: "success", color: designTokens.colors.success },
      { name: "error", color: designTokens.colors.error },
      { name: "warning", color: designTokens.colors.warning },
      { name: "accent", color: designTokens.colors.accent },
      { name: "neutral", color: designTokens.colors.neutral },
    ];
  };

  // Handler for component customization changes
  const handleComponentCustomization = (
    key: string,
    value: any,
  ) => {
    setComponentCustomizations((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <LivePreviewStyles />


      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetStore();
                  setCurrentStep("input");
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="font-semibold text-lg">
                  Design System Generator
                </h1>
                <p className="text-sm text-muted-foreground">
                  {generationMethod === "vision" &&
                    "Customize your design tokens and preview components based on your vision"}
                  {generationMethod === "persona" &&
                    `Design system generated using "${selectedPersona}" style direction`}
                  {generationMethod === "chaos" &&
                    "Experimental design system with bold, unconventional choices"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {isGenerating ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-8 w-full max-w-md text-center space-y-4">
              <h3 className="font-semibold">
                {generationMethod === "vision" &&
                  "Analyzing Your Vision"}
                {generationMethod === "persona" &&
                  "Applying Style Direction"}
                {generationMethod === "chaos" &&
                  "Unleashing Creative Chaos"}
              </h3>
              <Progress
                value={generationProgress}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                {generationMethod === "vision" &&
                  `Processing ${visionImages.length} image(s) and generating your design system...`}
                {generationMethod === "persona" &&
                  `Creating design system based on "${selectedPersona}" style...`}
                {generationMethod === "chaos" &&
                  "Experimenting with bold design combinations..."}
              </p>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)] min-h-0">
            {/* Left Column - Controls */}
            <Card className="lg:col-span-1 p-6 space-y-6 overflow-y-auto h-full flex flex-col min-h-0">
              <h2 className="font-semibold text-lg">
                Design Controls
              </h2>

              <div className="space-y-4">
                {CONTROLS.map((control, index) => {
                  const isCompleted =
                    completedControls.includes(control.id);
                  const isActive = activeControl === control.id;
                  const isUnlocked =
                    index === 0 ||
                    completedControls.includes(
                      CONTROLS[index - 1].id,
                    );

                  return (
                    <div key={control.id} className="space-y-2">
                      <Button
                        variant={
                          isActive ? "default" : "outline"
                        }
                        className="w-full justify-start h-auto p-4"
                        onClick={() =>
                          handleControlClick(control.id)
                        }
                        disabled={!isUnlocked}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <control.icon className="h-5 w-5" />
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {control.label}
                              </span>
                              {isCompleted && (
                                <CheckIcon className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {control.description}
                            </p>
                          </div>
                        </div>
                      </Button>

                      {isActive && (
                        <Card className="p-4 ml-4 border-l-2 border-primary">
                          <div className="space-y-3">
                            {control.id === "color" &&
                              designTokens && (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm">
                                      Color Palette
                                    </h4>
                                    {colorHistory.length >
                                      0 && (
                                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">
                                          {navigator.platform.includes(
                                            "Mac",
                                          )
                                            ? "⌘"
                                            : "Ctrl"}
                                          +Z
                                        </kbd>
                                        <span>
                                          to undo (
                                          {colorHistory.length})
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-4">
                                    {Object.entries(
                                      designTokens.colors,
                                    ).map(([key, value]) => (
                                      <ColorPicker
                                        key={key}
                                        colorKey={
                                          key as keyof typeof designTokens.colors
                                        }
                                        colorValue={value}
                                        colorLabel={key}
                                        onColorChange={
                                          updateColorToken
                                        }
                                      />
                                    ))}
                                  </div>
                                  <div className="pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleControlComplete(
                                          "color",
                                        )
                                      }
                                      disabled={isCompleted}
                                      className="w-full"
                                    >
                                      {isCompleted
                                        ? "Colors Approved ✓"
                                        : "Approve Color Palette"}
                                    </Button>
                                  </div>
                                </div>
                              )}

                            {control.id === "typography" &&
                              designTokens && (
                                <div className="space-y-4">
                                  <h4 className="font-medium text-sm">
                                    Typography
                                  </h4>
                                  <FontSelector
                                    currentHeadingFont={
                                      designTokens.typography
                                        .headingFont
                                    }
                                    currentBodyFont={
                                      designTokens.typography
                                        .bodyFont
                                    }
                                    currentScale={
                                      designTokens.typography
                                        .scale
                                    }
                                    currentBaseFontSizeDesktop={
                                      designTokens.typography
                                        .baseFontSizeDesktop
                                    }
                                    currentBaseFontSizeMobile={
                                      designTokens.typography
                                        .baseFontSizeMobile
                                    }
                                    originalHeadingFont={
                                      originalDesignTokens
                                        ?.typography.headingFont
                                    }
                                    originalBodyFont={
                                      originalDesignTokens
                                        ?.typography.bodyFont
                                    }
                                    onFontChange={
                                      updateTypographyFont
                                    }
                                    onScaleChange={
                                      updateTypographyScale
                                    }
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleControlComplete(
                                        "typography",
                                      )
                                    }
                                    disabled={isCompleted}
                                    className="w-full"
                                  >
                                    {isCompleted
                                      ? "Typography Approved ✓"
                                      : "Approve Typography"}
                                  </Button>
                                </div>
                              )}

                            {control.id === "components" && (
                              <div className="space-y-4">
                                <h4 className="font-medium text-sm">
                                  Components
                                </h4>

                                {/* Component List with Enhanced Customization - Only components actually in preview */}
                                <div className="space-y-4">
                                  {/* Navigation Component */}
                                  <div className="p-3 border rounded-lg space-y-3">
                                    <div className="flex items-center gap-2">
                                      <CheckIcon className="h-4 w-4 text-green-600" />
                                      <span className="font-medium text-sm">
                                        Navigation
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Logo Color
                                        </Label>
                                        <select
                                          className="w-full mt-1 px-2 py-1 border rounded text-xs"
                                          value={
                                            componentCustomizations.navigationFillColor
                                          }
                                          onChange={(e) =>
                                            handleComponentCustomization(
                                              "navigationFillColor",
                                              e.target.value,
                                            )
                                          }
                                        >
                                          {getColorOptions().map(
                                            (option) => (
                                              <option
                                                key={
                                                  option.name
                                                }
                                                value={
                                                  option.name
                                                }
                                              >
                                                {option.name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  option.name.slice(
                                                    1,
                                                  )}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Border Color
                                        </Label>
                                        <select
                                          className="w-full mt-1 px-2 py-1 border rounded text-xs"
                                          value={
                                            componentCustomizations.navigationStrokeColor
                                          }
                                          onChange={(e) =>
                                            handleComponentCustomization(
                                              "navigationStrokeColor",
                                              e.target.value,
                                            )
                                          }
                                        >
                                          {getColorOptions().map(
                                            (option) => (
                                              <option
                                                key={
                                                  option.name
                                                }
                                                value={
                                                  option.name
                                                }
                                              >
                                                {option.name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  option.name.slice(
                                                    1,
                                                  )}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Button Component */}
                                  <div className="p-3 border rounded-lg space-y-3">
                                    <div className="flex items-center gap-2">
                                      <CheckIcon className="h-4 w-4 text-green-600" />
                                      <span className="font-medium text-sm">
                                        Button
                                      </span>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-xs text-muted-foreground">
                                        Padding
                                      </Label>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-1">
                                          <span className="w-8 text-muted-foreground">
                                            X:
                                          </span>
                                          <input
                                            type="number"
                                            value={
                                              componentCustomizations.buttonPaddingX
                                            }
                                            onChange={(e) =>
                                              handleComponentCustomization(
                                                "buttonPaddingX",
                                                parseInt(
                                                  e.target
                                                    .value,
                                                ),
                                              )
                                            }
                                            className="w-12 px-1 py-0.5 border rounded text-center"
                                            min="4"
                                            max="48"
                                          />
                                          <span className="text-muted-foreground">
                                            px
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <span className="w-8 text-muted-foreground">
                                            Y:
                                          </span>
                                          <input
                                            type="number"
                                            value={
                                              componentCustomizations.buttonPaddingY
                                            }
                                            onChange={(e) =>
                                              handleComponentCustomization(
                                                "buttonPaddingY",
                                                parseInt(
                                                  e.target
                                                    .value,
                                                ),
                                              )
                                            }
                                            className="w-12 px-1 py-0.5 border rounded text-center"
                                            min="4"
                                            max="32"
                                          />
                                          <span className="text-muted-foreground">
                                            px
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Fill Color
                                        </Label>
                                        <select
                                          className="w-full mt-1 px-2 py-1 border rounded text-xs"
                                          value={
                                            componentCustomizations.buttonFillColor
                                          }
                                          onChange={(e) =>
                                            handleComponentCustomization(
                                              "buttonFillColor",
                                              e.target.value,
                                            )
                                          }
                                        >
                                          {getColorOptions().map(
                                            (option) => (
                                              <option
                                                key={
                                                  option.name
                                                }
                                                value={
                                                  option.name
                                                }
                                              >
                                                {option.name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  option.name.slice(
                                                    1,
                                                  )}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Border Color
                                        </Label>
                                        <select
                                          className="w-full mt-1 px-2 py-1 border rounded text-xs"
                                          value={
                                            componentCustomizations.buttonStrokeColor
                                          }
                                          onChange={(e) =>
                                            handleComponentCustomization(
                                              "buttonStrokeColor",
                                              e.target.value,
                                            )
                                          }
                                        >
                                          {getColorOptions().map(
                                            (option) => (
                                              <option
                                                key={
                                                  option.name
                                                }
                                                value={
                                                  option.name
                                                }
                                              >
                                                {option.name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  option.name.slice(
                                                    1,
                                                  )}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Card Component */}
                                  <div className="p-3 border rounded-lg space-y-3">
                                    <div className="flex items-center gap-2">
                                      <CheckIcon className="h-4 w-4 text-green-600" />
                                      <span className="font-medium text-sm">
                                        Card
                                      </span>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-xs text-muted-foreground">
                                        Padding
                                      </Label>
                                      <div className="flex items-center gap-1 text-xs">
                                        <span className="w-8 text-muted-foreground">
                                          All:
                                        </span>
                                        <input
                                          type="number"
                                          value={
                                            componentCustomizations.cardPadding
                                          }
                                          onChange={(e) =>
                                            handleComponentCustomization(
                                              "cardPadding",
                                              parseInt(
                                                e.target.value,
                                              ),
                                            )
                                          }
                                          className="w-12 px-1 py-0.5 border rounded text-center"
                                          min="8"
                                          max="32"
                                        />
                                        <span className="text-muted-foreground">
                                          px
                                        </span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Background
                                        </Label>
                                        <select
                                          className="w-full mt-1 px-2 py-1 border rounded text-xs"
                                          value={
                                            componentCustomizations.cardFillColor
                                          }
                                          onChange={(e) =>
                                            handleComponentCustomization(
                                              "cardFillColor",
                                              e.target.value,
                                            )
                                          }
                                        >
                                          {getColorOptions().map(
                                            (option) => (
                                              <option
                                                key={
                                                  option.name
                                                }
                                                value={
                                                  option.name
                                                }
                                              >
                                                {option.name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  option.name.slice(
                                                    1,
                                                  )}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Border
                                        </Label>
                                        <select
                                          className="w-full mt-1 px-2 py-1 border rounded text-xs"
                                          value={
                                            componentCustomizations.cardStrokeColor
                                          }
                                          onChange={(e) =>
                                            handleComponentCustomization(
                                              "cardStrokeColor",
                                              e.target.value,
                                            )
                                          }
                                        >
                                          {getColorOptions().map(
                                            (option) => (
                                              <option
                                                key={
                                                  option.name
                                                }
                                                value={
                                                  option.name
                                                }
                                              >
                                                {option.name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  option.name.slice(
                                                    1,
                                                  )}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Input & Textarea Component */}
                                  <div className="p-3 border rounded-lg space-y-3">
                                    <div className="flex items-center gap-2">
                                      <CheckIcon className="h-4 w-4 text-green-600" />
                                      <span className="font-medium text-sm">
                                        Input & Textarea
                                      </span>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-xs text-muted-foreground">
                                        Padding
                                      </Label>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-1">
                                          <span className="w-8 text-muted-foreground">
                                            X:
                                          </span>
                                          <input
                                            type="number"
                                            value={
                                              componentCustomizations.inputPaddingX
                                            }
                                            onChange={(e) =>
                                              handleComponentCustomization(
                                                "inputPaddingX",
                                                parseInt(
                                                  e.target
                                                    .value,
                                                ),
                                              )
                                            }
                                            className="w-12 px-1 py-0.5 border rounded text-center"
                                            min="4"
                                            max="24"
                                          />
                                          <span className="text-muted-foreground">
                                            px
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <span className="w-8 text-muted-foreground">
                                            Y:
                                          </span>
                                          <input
                                            type="number"
                                            value={
                                              componentCustomizations.inputPaddingY
                                            }
                                            onChange={(e) =>
                                              handleComponentCustomization(
                                                "inputPaddingY",
                                                parseInt(
                                                  e.target
                                                    .value,
                                                ),
                                              )
                                            }
                                            className="w-12 px-1 py-0.5 border rounded text-center"
                                            min="4"
                                            max="16"
                                          />
                                          <span className="text-muted-foreground">
                                            px
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Border Color
                                        </Label>
                                        <select
                                          className="w-full mt-1 px-2 py-1 border rounded text-xs"
                                          value={
                                            componentCustomizations.inputStrokeColor
                                          }
                                          onChange={(e) =>
                                            handleComponentCustomization(
                                              "inputStrokeColor",
                                              e.target.value,
                                            )
                                          }
                                        >
                                          {getColorOptions().map(
                                            (option) => (
                                              <option
                                                key={
                                                  option.name
                                                }
                                                value={
                                                  option.name
                                                }
                                              >
                                                {option.name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  option.name.slice(
                                                    1,
                                                  )}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Focus Color
                                        </Label>
                                        <select
                                          className="w-full mt-1 px-2 py-1 border rounded text-xs"
                                          value={
                                            componentCustomizations.inputFillColor
                                          }
                                          onChange={(e) =>
                                            handleComponentCustomization(
                                              "inputFillColor",
                                              e.target.value,
                                            )
                                          }
                                        >
                                          {getColorOptions().map(
                                            (option) => (
                                              <option
                                                key={
                                                  option.name
                                                }
                                                value={
                                                  option.name
                                                }
                                              >
                                                {option.name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  option.name.slice(
                                                    1,
                                                  )}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Typography Component */}
                                  <div className="p-3 border rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <CheckIcon className="h-4 w-4 text-green-600" />
                                      <span className="font-medium text-sm">
                                        Typography
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Typography styles are
                                      controlled in the
                                      Typography section above.
                                    </p>
                                  </div>
                                </div>

                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleControlComplete(
                                      "components",
                                    )
                                  }
                                  disabled={isCompleted}
                                  className="w-full"
                                >
                                  {isCompleted
                                    ? "Components Approved ✓"
                                    : "Approve Components"}
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Create System Button */}
              <div className="pt-4">
                <Button
                  onClick={() => {
                    useDesignSystemStore
                      .getState()
                      .setAllComponentCustomizations(
                        componentCustomizations,
                      );
                    setCurrentStep("completion");
                  }}
                  disabled={!canProceed}
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                >
                  Create system
                  {canProceed && (
                    <ArrowRightIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Card>

            {/* Right Column - Preview */}
            <Card className="lg:col-span-2 p-6 space-y-4 flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">
                    Live Preview
                  </h2>
                  {designTokens && (
                    <p className="text-xs text-muted-foreground">
                      Preview updates automatically as you
                      customize your design tokens
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setViewportMode(
                        viewportMode === "desktop"
                          ? "mobile"
                          : "desktop",
                      )
                    }
                    className="flex items-center gap-2"
                  >
                    {viewportMode === "desktop" ? (
                      <>
                        <MonitorIcon className="h-4 w-4" />
                        Desktop
                      </>
                    ) : (
                      <>
                        <SmartphoneIcon className="h-4 w-4" />
                        Mobile
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex-1 border border-border rounded-lg overflow-hidden">
                <div className="live-preview-container h-full bg-white">
                  {designTokens ? (
                    <div className="p-8 space-y-8 h-full overflow-y-auto">
                      {/* Enhanced preview showing design system in realistic interface */}
                      <div className="space-y-8">
                        {/* Navigation Bar */}
                        <div
                          className="pb-4 border-b-2 relative"
                          style={{
                            borderColor:
                              designTokens.colors[
                                componentCustomizations.navigationStrokeColor as keyof typeof designTokens.colors
                              ],
                            padding: "16px",
                          }}
                        >
                          {viewportMode === "mobile" ? (
                            /* Mobile Navigation */
                            <>
                              <div className="flex items-center justify-between">
                                {/* Logo */}
                                <div
                                  className="w-8 h-8 rounded-lg"
                                  style={{
                                    backgroundColor:
                                      designTokens.colors[
                                        componentCustomizations.navigationFillColor as keyof typeof designTokens.colors
                                      ],
                                  }}
                                ></div>

                                {/* Avatar + Hamburger */}
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110"
                                    style={{
                                      backgroundColor:
                                        "var(--preview-secondary)",
                                    }}
                                  ></div>

                                  {/* Hamburger Menu */}
                                  <button
                                    className="flex flex-col gap-1 p-1 transition-transform hover:scale-110"
                                    onClick={() =>
                                      setIsMobileMenuOpen(
                                        !isMobileMenuOpen,
                                      )
                                    }
                                  >
                                    <div
                                      className="w-5 h-0.5 rounded-full transition-all"
                                      style={{
                                        backgroundColor:
                                          designTokens.colors[
                                            componentCustomizations.navigationFillColor as keyof typeof designTokens.colors
                                          ],
                                        transform:
                                          isMobileMenuOpen
                                            ? "rotate(45deg) translateY(6px)"
                                            : "none",
                                      }}
                                    ></div>
                                    <div
                                      className="w-5 h-0.5 rounded-full transition-all"
                                      style={{
                                        backgroundColor:
                                          designTokens.colors[
                                            componentCustomizations.navigationFillColor as keyof typeof designTokens.colors
                                          ],
                                        opacity:
                                          isMobileMenuOpen
                                            ? "0"
                                            : "1",
                                      }}
                                    ></div>
                                    <div
                                      className="w-5 h-0.5 rounded-full transition-all"
                                      style={{
                                        backgroundColor:
                                          designTokens.colors[
                                            componentCustomizations.navigationFillColor as keyof typeof designTokens.colors
                                          ],
                                        transform:
                                          isMobileMenuOpen
                                            ? "rotate(-45deg) translateY(-6px)"
                                            : "none",
                                      }}
                                    ></div>
                                  </button>
                                </div>
                              </div>

                              {/* Mobile Menu Dropdown */}
                              {isMobileMenuOpen && (
                                <div
                                  className="absolute top-full left-0 right-0 mt-2 py-4 px-4 bg-white border rounded-lg shadow-lg z-50"
                                  style={{
                                    borderColor:
                                      designTokens.colors[
                                        componentCustomizations.navigationStrokeColor as keyof typeof designTokens.colors
                                      ],
                                  }}
                                >
                                  <nav className="flex flex-col gap-3">
                                    <a
                                      href="#"
                                      className="p-2 rounded transition-colors hover:opacity-80"
                                      style={{
                                        fontFamily:
                                          "var(--preview-body-font)",
                                        fontSize:
                                          "var(--preview-font-size-base)",
                                        color:
                                          designTokens.colors[
                                            componentCustomizations.navigationFillColor as keyof typeof designTokens.colors
                                          ],
                                        fontWeight: "500",
                                      }}
                                    >
                                      Dashboard
                                    </a>
                                    <a
                                      href="#"
                                      className="p-2 rounded transition-colors hover:opacity-80"
                                      style={{
                                        fontFamily:
                                          "var(--preview-body-font)",
                                        fontSize:
                                          "var(--preview-font-size-base)",
                                        color:
                                          "var(--preview-neutral)",
                                      }}
                                    >
                                      Projects
                                    </a>
                                    <a
                                      href="#"
                                      className="p-2 rounded transition-colors hover:opacity-80"
                                      style={{
                                        fontFamily:
                                          "var(--preview-body-font)",
                                        fontSize:
                                          "var(--preview-font-size-base)",
                                        color:
                                          "var(--preview-neutral)",
                                      }}
                                    >
                                      Settings
                                    </a>
                                  </nav>
                                </div>
                              )}
                            </>
                          ) : (
                            /* Desktop Navigation */
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <div
                                  className="w-8 h-8 rounded-lg"
                                  style={{
                                    backgroundColor:
                                      designTokens.colors[
                                        componentCustomizations.navigationFillColor as keyof typeof designTokens.colors
                                      ],
                                  }}
                                ></div>
                                <nav className="flex items-center gap-6">
                                  <a
                                    href="#"
                                    className="transition-colors hover:opacity-80"
                                    style={{
                                      fontFamily:
                                        "var(--preview-body-font)",
                                      fontSize:
                                        "var(--preview-font-size-sm)",
                                      color:
                                        designTokens.colors[
                                          componentCustomizations.navigationFillColor as keyof typeof designTokens.colors
                                        ],
                                      fontWeight: "500",
                                    }}
                                  >
                                    Dashboard
                                  </a>
                                  <a
                                    href="#"
                                    className="transition-colors hover:opacity-80"
                                    style={{
                                      fontFamily:
                                        "var(--preview-body-font)",
                                      fontSize:
                                        "var(--preview-font-size-sm)",
                                      color:
                                        "var(--preview-neutral)",
                                    }}
                                  >
                                    Projects
                                  </a>
                                  <a
                                    href="#"
                                    className="transition-colors hover:opacity-80"
                                    style={{
                                      fontFamily:
                                        "var(--preview-body-font)",
                                      fontSize:
                                        "var(--preview-font-size-sm)",
                                      color:
                                        "var(--preview-neutral)",
                                    }}
                                  >
                                    Settings
                                  </a>
                                </nav>
                              </div>
                              <div
                                className="w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110"
                                style={{
                                  backgroundColor:
                                    "var(--preview-secondary)",
                                }}
                              ></div>
                            </div>
                          )}
                        </div>

                        {/* Header Section */}
                        <div className="space-y-4">
                          <h1
                            style={{
                              fontFamily:
                                "var(--preview-heading-font)",
                              fontSize:
                                "var(--preview-font-size-4xl)",
                              color: "var(--preview-primary)",
                              fontWeight: "700",
                              lineHeight: "1.2",
                            }}
                          >
                            Welcome to Aether
                          </h1>
                          <p
                            style={{
                              fontFamily:
                                "var(--preview-body-font)",
                              fontSize:
                                "var(--preview-font-size-lg)",
                              color: "var(--preview-neutral)",
                              lineHeight: "1.6",
                            }}
                          >
                            Your design system is looking great!
                            This preview shows how your colors
                            and typography work together in a
                            real interface.
                          </p>
                        </div>

                        {/* Status Cards */}
                        <div
                          className={`${viewportMode === "mobile" ? "flex flex-col gap-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}`}
                        >
                          <div
                            className="rounded-lg border-2 transition-transform hover:scale-105 cursor-pointer"
                            style={{
                              borderColor:
                                "var(--preview-success)",
                              backgroundColor:
                                "rgba(16, 185, 129, 0.05)",
                              padding: `${componentCustomizations.cardPadding}px`,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{
                                  backgroundColor:
                                    "var(--preview-success)",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontFamily:
                                    "var(--preview-body-font)",
                                  fontSize:
                                    "var(--preview-font-size-sm)",
                                  color:
                                    "var(--preview-success)",
                                  fontWeight: "600",
                                }}
                              >
                                Active
                              </span>
                            </div>
                            <div
                              style={{
                                fontFamily:
                                  "var(--preview-heading-font)",
                                fontSize:
                                  "var(--preview-font-size-2xl)",
                                color: "var(--preview-success)",
                                fontWeight: "700",
                              }}
                            >
                              24
                            </div>
                            <div
                              style={{
                                fontFamily:
                                  "var(--preview-body-font)",
                                fontSize:
                                  "var(--preview-font-size-sm)",
                                color: "var(--preview-neutral)",
                              }}
                            >
                              Projects
                            </div>
                          </div>

                          <div
                            className="rounded-lg border-2 transition-transform hover:scale-105 cursor-pointer"
                            style={{
                              borderColor:
                                "var(--preview-warning)",
                              backgroundColor:
                                "rgba(245, 158, 11, 0.05)",
                              padding: `${componentCustomizations.cardPadding}px`,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    "var(--preview-warning)",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontFamily:
                                    "var(--preview-body-font)",
                                  fontSize:
                                    "var(--preview-font-size-sm)",
                                  color:
                                    "var(--preview-warning)",
                                  fontWeight: "600",
                                }}
                              >
                                Pending
                              </span>
                            </div>
                            <div
                              style={{
                                fontFamily:
                                  "var(--preview-heading-font)",
                                fontSize:
                                  "var(--preview-font-size-2xl)",
                                color: "var(--preview-warning)",
                                fontWeight: "700",
                              }}
                            >
                              8
                            </div>
                            <div
                              style={{
                                fontFamily:
                                  "var(--preview-body-font)",
                                fontSize:
                                  "var(--preview-font-size-sm)",
                                color: "var(--preview-neutral)",
                              }}
                            >
                              Reviews
                            </div>
                          </div>

                          <div
                            className="rounded-lg border-2 transition-transform hover:scale-105 cursor-pointer"
                            style={{
                              borderColor:
                                "var(--preview-error)",
                              backgroundColor:
                                "rgba(239, 68, 68, 0.05)",
                              padding: `${componentCustomizations.cardPadding}px`,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    "var(--preview-error)",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontFamily:
                                    "var(--preview-body-font)",
                                  fontSize:
                                    "var(--preview-font-size-sm)",
                                  color: "var(--preview-error)",
                                  fontWeight: "600",
                                }}
                              >
                                Issues
                              </span>
                            </div>
                            <div
                              style={{
                                fontFamily:
                                  "var(--preview-heading-font)",
                                fontSize:
                                  "var(--preview-font-size-2xl)",
                                color: "var(--preview-error)",
                                fontWeight: "700",
                              }}
                            >
                              3
                            </div>
                            <div
                              style={{
                                fontFamily:
                                  "var(--preview-body-font)",
                                fontSize:
                                  "var(--preview-font-size-sm)",
                                color: "var(--preview-neutral)",
                              }}
                            >
                              To resolve
                            </div>
                          </div>
                        </div>

                        {/* Action Section with Form */}
                        <div className="space-y-6">
                          <h2
                            style={{
                              fontFamily:
                                "var(--preview-heading-font)",
                              fontSize:
                                "var(--preview-font-size-2xl)",
                              color: "var(--preview-primary)",
                              fontWeight: "600",
                            }}
                          >
                            Quick Actions
                          </h2>

                          <div
                            className={`${viewportMode === "mobile" ? "flex flex-col gap-6" : "flex flex-col xl:grid xl:grid-cols-2 gap-6"}`}
                          >
                            {/* Form Section */}
                            <div
                              className="rounded-lg transition-shadow hover:shadow-lg"
                              style={{
                                backgroundColor:
                                  designTokens.colors[
                                    componentCustomizations.cardFillColor as keyof typeof designTokens.colors
                                  ],
                                padding: `${componentCustomizations.cardPadding + 8}px`,
                              }}
                            >
                              <h3
                                style={{
                                  fontFamily:
                                    "var(--preview-heading-font)",
                                  fontSize:
                                    "var(--preview-font-size-lg)",
                                  color:
                                    "var(--preview-neutral)",
                                  fontWeight: "600",
                                  marginBottom: "16px",
                                }}
                              >
                                Create New Project
                              </h3>

                              <div className="space-y-4">
                                <div>
                                  <label
                                    style={{
                                      fontFamily:
                                        "var(--preview-body-font)",
                                      fontSize:
                                        "var(--preview-font-size-sm)",
                                      color:
                                        "var(--preview-neutral)",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Project Name
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Enter project name"
                                    className="w-full mt-1 rounded-md border transition-all hover:shadow-sm focus:shadow-md"
                                    style={{
                                      borderColor:
                                        designTokens.colors[
                                          componentCustomizations.inputStrokeColor as keyof typeof designTokens.colors
                                        ],
                                      fontFamily:
                                        "var(--preview-body-font)",
                                      fontSize:
                                        "var(--preview-font-size-sm)",
                                      padding: `${componentCustomizations.inputPaddingY}px ${componentCustomizations.inputPaddingX}px`,
                                    }}
                                  />
                                </div>

                                <div>
                                  <label
                                    style={{
                                      fontFamily:
                                        "var(--preview-body-font)",
                                      fontSize:
                                        "var(--preview-font-size-sm)",
                                      color:
                                        "var(--preview-neutral)",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Description
                                  </label>
                                  <textarea
                                    placeholder="Project description..."
                                    className="w-full mt-1 rounded-md border resize-none transition-all hover:shadow-sm focus:shadow-md"
                                    rows={3}
                                    style={{
                                      borderColor:
                                        designTokens.colors[
                                          componentCustomizations.inputStrokeColor as keyof typeof designTokens.colors
                                        ],
                                      fontFamily:
                                        "var(--preview-body-font)",
                                      fontSize:
                                        "var(--preview-font-size-sm)",
                                      padding: `${componentCustomizations.inputPaddingY}px ${componentCustomizations.inputPaddingX}px`,
                                    }}
                                  />
                                </div>

                                <button
                                  className="w-full rounded-md font-medium transition-all hover:shadow-lg hover:scale-105 group relative"
                                  style={{
                                    backgroundColor:
                                      designTokens.colors[
                                        componentCustomizations.buttonFillColor as keyof typeof designTokens.colors
                                      ],
                                    color: "white",
                                    fontFamily:
                                      "var(--preview-body-font)",
                                    fontSize:
                                      "var(--preview-font-size-sm)",
                                    padding: `${componentCustomizations.buttonPaddingY}px ${componentCustomizations.buttonPaddingX}px`,
                                  }}
                                  title="Uses Primary Color"
                                >
                                  Create Project
                                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {componentCustomizations.buttonFillColor
                                      .charAt(0)
                                      .toUpperCase() +
                                      componentCustomizations.buttonFillColor.slice(
                                        1,
                                      )}
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Actions Grid */}
                            <div className="space-y-4">
                              <div
                                className={`flex ${viewportMode === "mobile" ? "flex-col" : "flex-col sm:flex-row"} gap-3`}
                              >
                                <button
                                  className="rounded-md font-medium transition-all hover:shadow-lg hover:scale-105 group relative"
                                  style={{
                                    backgroundColor:
                                      designTokens.colors[
                                        componentCustomizations.buttonFillColor as keyof typeof designTokens.colors
                                      ],
                                    color: "white",
                                    fontFamily:
                                      "var(--preview-body-font)",
                                    fontSize:
                                      "var(--preview-font-size-base)",
                                    padding: `${componentCustomizations.buttonPaddingY}px ${componentCustomizations.buttonPaddingX}px`,
                                  }}
                                  title="Uses Primary Color"
                                >
                                  Primary Action
                                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {componentCustomizations.buttonFillColor
                                      .charAt(0)
                                      .toUpperCase() +
                                      componentCustomizations.buttonFillColor.slice(
                                        1,
                                      )}{" "}
                                    Fill
                                  </span>
                                </button>
                                <button
                                  className="rounded-md border-2 font-medium transition-all hover:shadow-md hover:scale-105 group relative"
                                  style={{
                                    borderColor:
                                      designTokens.colors[
                                        componentCustomizations.buttonStrokeColor as keyof typeof designTokens.colors
                                      ],
                                    color:
                                      designTokens.colors[
                                        componentCustomizations.buttonStrokeColor as keyof typeof designTokens.colors
                                      ],
                                    backgroundColor:
                                      "transparent",
                                    fontFamily:
                                      "var(--preview-body-font)",
                                    fontSize:
                                      "var(--preview-font-size-base)",
                                    padding: `${componentCustomizations.buttonPaddingY}px ${componentCustomizations.buttonPaddingX}px`,
                                  }}
                                  title="Uses Primary Border/Text"
                                >
                                  Secondary
                                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {componentCustomizations.buttonStrokeColor
                                      .charAt(0)
                                      .toUpperCase() +
                                      componentCustomizations.buttonStrokeColor.slice(
                                        1,
                                      )}{" "}
                                    Border
                                  </span>
                                </button>
                              </div>

                              {/* Feature List */}
                              <div className="space-y-3">
                                <h4
                                  style={{
                                    fontFamily:
                                      "var(--preview-heading-font)",
                                    fontSize:
                                      "var(--preview-font-size-base)",
                                    color:
                                      "var(--preview-primary)",
                                    fontWeight: "600",
                                  }}
                                >
                                  Recent Activity
                                </h4>

                                <div className="space-y-2">
                                  {[
                                    {
                                      text: "Design system updated",
                                      time: "2 min ago",
                                      type: "success",
                                    },
                                    {
                                      text: "New component added",
                                      time: "1 hour ago",
                                      type: "primary",
                                    },
                                    {
                                      text: "Review requested",
                                      time: "3 hours ago",
                                      type: "warning",
                                    },
                                  ].map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-3 p-2 rounded cursor-pointer transition-all hover:shadow-sm hover:scale-102"
                                      style={{
                                        backgroundColor:
                                          "rgba(0,0,0,0.02)",
                                      }}
                                    >
                                      <div
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                          backgroundColor:
                                            item.type ===
                                            "success"
                                              ? "var(--preview-success)"
                                              : item.type ===
                                                  "warning"
                                                ? "var(--preview-warning)"
                                                : "var(--preview-primary)",
                                        }}
                                      ></div>
                                      <div className="flex-1">
                                        <div
                                          style={{
                                            fontFamily:
                                              "var(--preview-body-font)",
                                            fontSize:
                                              "var(--preview-font-size-sm)",
                                            color:
                                              "var(--preview-neutral)",
                                          }}
                                        >
                                          {item.text}
                                        </div>
                                        <div
                                          style={{
                                            fontFamily:
                                              "var(--preview-body-font)",
                                            fontSize:
                                              "var(--preview-font-size-xs)",
                                            color:
                                              "var(--preview-neutral)",
                                          }}
                                        >
                                          {item.time}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Generate your design system to see the
                      preview
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}