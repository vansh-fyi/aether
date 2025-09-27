import { create } from "zustand";

export type AppStep = "input" | "generator" | "completion";

export interface ColorPalette {
  primary: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  accent: string;
  neutral: string;
}

export interface TypographyTokens {
  headingFont: string;
  bodyFont: string;
  baseFontSizeDesktop: number; // Base size in pixels for desktop
  baseFontSizeMobile: number; // Base size in pixels for mobile
  scale:
    | "minor-second"
    | "major-second"
    | "minor-third"
    | "major-third"
    | "perfect-fourth"
    | "golden-ratio";
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
  };
}

export interface DesignTokens {
  colors: ColorPalette;
  typography: TypographyTokens;
}

export type GenerationMethod =
  | "vision"
  | "persona"
  | "chaos"
  | null;

export interface ComponentCustomizations {
  buttonPaddingX: number;
  buttonPaddingY: number;
  buttonFillColor: string;
  buttonStrokeColor: string;
  cardPadding: number;
  cardFillColor: string;
  cardStrokeColor: string;
  inputPaddingX: number;
  inputPaddingY: number;
  inputFillColor: string;
  inputStrokeColor: string;
  navigationFillColor: string;
  navigationStrokeColor: string;
}

export interface DesignSystemStore {
  // Current application step
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;

  // Generation method selection
  generationMethod: GenerationMethod;
  setGenerationMethod: (method: GenerationMethod) => void;

  // User inputs
  visionImages: File[];
  setVisionImages: (images: File[]) => void;
  addVisionImage: (image: File) => void;
  removeVisionImage: (index: number) => void;

  selectedPersona: string | null;
  setSelectedPersona: (persona: string | null) => void;

  chaosMode: boolean;
  setChaosMode: (enabled: boolean) => void;

  // ADDED: API key state and management
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  hasSkippedApiKey: boolean;
  setHasSkippedApiKey: (skipped: boolean) => void;

  // Generated design tokens
  designTokens: DesignTokens | null;
  setDesignTokens: (tokens: DesignTokens | null) => void;

  // Individual token updates
  updateColorToken: (
    colorKey: keyof ColorPalette,
    value: string,
  ) => void;
  updateTypographyFont: (
    headingFont: string,
    bodyFont: string,
  ) => void;
  updateTypographyScale: (
    scale: TypographyTokens["scale"],
    baseFontSizeDesktop?: number,
    baseFontSizeMobile?: number,
  ) => void;

  // Color history for undo functionality
  colorHistory: ColorPalette[];
  undoColorChange: () => void;
  originalDesignTokens: DesignTokens | null;

  // Generator state
  activeControl: "color" | "typography" | "components" | null;
  setActiveControl: (
    control: "color" | "typography" | "components" | null,
  ) => void;

  previewMode: "light" | "dark";
  setPreviewMode: (mode: "light" | "dark") => void;

  viewportMode: "desktop" | "mobile";
  setViewportMode: (mode: "desktop" | "mobile") => void;

  // Generated components
  generatedComponents: string[];
  setGeneratedComponents: (components: string[]) => void;

  componentCustomizations: ComponentCustomizations;
  setComponentCustomization: (
    key: keyof ComponentCustomizations,
    value: any,
  ) => void;

  setAllComponentCustomizations: (
    customizations: ComponentCustomizations,
  ) => void;

  // Actions
  resetStore: () => void;
}

const initialState = {
  currentStep: "input" as AppStep,
  generationMethod: null as GenerationMethod,
  visionImages: [],
  selectedPersona: null,
  chaosMode: false,
  // ADDED: Initial state for API key - Always use Aether's model
  apiKey: "AETHER_MODEL",
  hasSkippedApiKey: true,
  designTokens: null,
  originalDesignTokens: null,
  activeControl: null,
  previewMode: "light" as const,
  viewportMode: "desktop" as const,
  generatedComponents: [],
  colorHistory: [],
  componentCustomizations: {
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
  },
};

export function calculateFontSizeObject(
  scale: TypographyTokens["scale"],
  baseSize: number,
): TypographyTokens["fontSize"] {
  const scaleRatios = {
    "minor-second": 1.067,
    "major-second": 1.125,
    "minor-third": 1.2,
    "major-third": 1.25,
    "perfect-fourth": 1.333,
    "golden-ratio": 1.618,
  };
  const ratio = scaleRatios[scale] || 1.25;
  return {
    xs: `${(1 / ratio / ratio).toFixed(3)}rem`,
    sm: `${(1 / ratio).toFixed(3)}rem`,
    base: "1rem",
    lg: `${ratio.toFixed(3)}rem`,
    xl: `${Math.pow(ratio, 2).toFixed(3)}rem`,
    "2xl": `${Math.pow(ratio, 3).toFixed(3)}rem`,
    "3xl": `${Math.pow(ratio, 4).toFixed(3)}rem`,
    "4xl": `${Math.pow(ratio, 5).toFixed(3)}rem`,
  };
}

export const useDesignSystemStore = create<DesignSystemStore>(
  (set, get) => ({
    ...initialState,

    setCurrentStep: (step) => set({ currentStep: step }),
    setGenerationMethod: (method) =>
      set({ generationMethod: method }),
    setVisionImages: (images) => set({ visionImages: images }),
    addVisionImage: (image) =>
      set((state) => ({
        visionImages: [...state.visionImages, image],
      })),
    setApiKey: (key) => set({ apiKey: key }),
    setHasSkippedApiKey: (skipped) =>
      set({ hasSkippedApiKey: skipped }),
    removeVisionImage: (index) =>
      set((state) => ({
        visionImages: state.visionImages.filter(
          (_, i) => i !== index,
        ),
      })),
    setSelectedPersona: (persona) =>
      set({ selectedPersona: persona }),
    setChaosMode: (enabled) => set({ chaosMode: enabled }),
    setDesignTokens: (tokens) =>
      set((state) => ({
        designTokens: tokens,
        originalDesignTokens:
          state.originalDesignTokens || tokens, // Store original on first set
      })),
    setActiveControl: (control) =>
      set({ activeControl: control }),
    setPreviewMode: (mode) => set({ previewMode: mode }),
    setViewportMode: (mode) => set({ viewportMode: mode }),
    setGeneratedComponents: (components) =>
      set({ generatedComponents: components }),
    setComponentCustomization: (key, value) =>
      set((state) => ({
        componentCustomizations: {
          ...state.componentCustomizations,
          [key]: value,
        },
      })),
    setAllComponentCustomizations: (customizations) =>
      set({ componentCustomizations: customizations }),

    updateColorToken: (colorKey, value) =>
      set((state) => {
        if (!state.designTokens) return state;

        // Add current colors to history (keep last 5)
        const newHistory = [
          state.designTokens.colors,
          ...state.colorHistory,
        ].slice(0, 5);

        return {
          designTokens: {
            ...state.designTokens,
            colors: {
              ...state.designTokens.colors,
              [colorKey]: value,
            },
          },
          colorHistory: newHistory,
        };
      }),

    undoColorChange: () =>
      set((state) => {
        if (
          !state.designTokens ||
          state.colorHistory.length === 0
        )
          return state;

        const [previousColors, ...remainingHistory] =
          state.colorHistory;

        return {
          designTokens: {
            ...state.designTokens,
            colors: previousColors,
          },
          colorHistory: remainingHistory,
        };
      }),

    updateTypographyFont: (headingFont, bodyFont) =>
      set((state) => ({
        designTokens: state.designTokens
          ? {
              ...state.designTokens,
              typography: {
                ...state.designTokens.typography,
                headingFont,
                bodyFont,
              },
            }
          : null,
      })),

    updateTypographyScale: (
      scale,
      baseFontSizeDesktop,
      baseFontSizeMobile,
    ) =>
      set((state) => {
        if (!state.designTokens) return state;

        // Use provided sizes or current ones
        const desktopSize =
          baseFontSizeDesktop ||
          state.designTokens.typography.baseFontSizeDesktop;
        const mobileSize =
          baseFontSizeMobile ||
          state.designTokens.typography.baseFontSizeMobile;

        // Typography scale ratios
        const scaleRatios = {
          "minor-second": 1.067,
          "major-second": 1.125,
          "minor-third": 1.2,
          "major-third": 1.25,
          "perfect-fourth": 1.333,
          "golden-ratio": 1.618,
        };

        const ratio = scaleRatios[scale];

        // Calculate rem sizes based on desktop base (1rem = desktopSize px)
        const fontSize = {
          xs: `${(1 / ratio / ratio).toFixed(3)}rem`,
          sm: `${(1 / ratio).toFixed(3)}rem`,
          base: "1rem",
          lg: `${(1 * ratio).toFixed(3)}rem`,
          xl: `${(1 * ratio * ratio).toFixed(3)}rem`,
          "2xl": `${(1 * Math.pow(ratio, 3)).toFixed(3)}rem`,
          "3xl": `${(1 * Math.pow(ratio, 4)).toFixed(3)}rem`,
          "4xl": `${(1 * Math.pow(ratio, 5)).toFixed(3)}rem`,
        };

        return {
          designTokens: {
            ...state.designTokens,
            typography: {
              ...state.designTokens.typography,
              scale,
              baseFontSizeDesktop: desktopSize,
              baseFontSizeMobile: mobileSize,
              fontSize,
            },
          },
        };
      }),

    resetStore: () => set(initialState),
  }),
);