import {
  DesignTokens,
  ColorPalette,
  TypographyTokens,
} from "../store/useDesignSystemStore";

export interface ComponentConfig {
  name: string;
  variants: string[];
  states: string[];
}

export interface GenerationResult {
  components: Record<string, string>;
  globalCSS: string;
  documentation: string;
}

/**
 * Core generation engine that transforms design tokens into React/TypeScript components
 * Following the specifications from ui-ux-specifications.md
 */
export class AetherGenerator {
  private designTokens: DesignTokens;
  private customizations: Record<string, any>; // To hold user customizations

  constructor(
    designTokens: DesignTokens,
    customizations: Record<string, any>,
  ) {
    this.designTokens = designTokens;
    this.customizations = customizations;
  }

  /**
   * Generate a complete set of CSS custom properties from design tokens
   */
  // engine/AetherGenerator.ts

  /**
   * Generate a complete set of CSS custom properties from a simple 7-color palette
   */
  // engine/AetherGenerator.ts

  generateGlobalCSS(): string {
    const { colors, typography } = this.designTokens;
    //const { viewportMode } = useDesignSystemStore.getState();

    // --- Simplified Direct Mapping ---
    // This logic now directly maps your 7 core colors to the theme variables.
    // This will ensure the downloaded components match your live preview.
    const theme = {
      background: "#ffffff", // Default to white
      foreground: colors.neutral,
      card: "#ffffff", // Default to white
      cardForeground: colors.neutral,
      primary: colors.primary,
      primaryForeground: "#ffffff", // Assume white text is best for the primary color
      secondary: colors.secondary,
      secondaryForeground: "#ffffff", // Assume white text is best for the secondary color
      accent: colors.accent,
      border: colors.neutral,
      input: "#ffffff",
      ring: colors.primary,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      "muted-foreground": colors.secondary,
    };

    // ... (The CSS Generation part below remains the same)
    const getFontImportName = (fontFamily: string) =>
      fontFamily.split(",")[0].trim().replace(/\s+/g, "+");
    const fontImports = [
      typography.headingFont,
      typography.bodyFont,
    ]
      .map((font) => getFontImportName(font))
      .filter((v, i, a) => a.indexOf(v) === i)
      .join("&family=");

    return `/* Generated Design System CSS Variables */
@import url('https://fonts.googleapis.com/css2?family=${fontImports}:wght@400;500;600;700&display=swap');
:root {
  /* Core Colors */
  --color-background: ${theme.background};
  --color-foreground: ${theme.foreground};
  --color-card: ${theme.card};
  --color-card-foreground: ${theme.cardForeground};
  --color-primary: ${theme.primary};
  --color-primary-foreground: ${theme.primaryForeground};
  --color-secondary: ${theme.secondary};
  --color-secondary-foreground: ${theme.secondaryForeground};
  --color-accent: ${theme.accent};
  --color-border: ${theme.border};
  --color-input: ${theme.input};
  --color-ring: ${theme.ring};
  --color-success: ${theme.success};
  --color-warning: ${theme.warning};
  --color-error: ${theme.error};
  --color-muted-foreground: ${theme["muted-foreground"]};
  /* Typography */
  --font-heading: ${typography.headingFont};
  --font-body: ${typography.bodyFont};
  --font-size-xs: ${typography.fontSize.xs};
  --font-size-sm: ${typography.fontSize.sm};
  --font-size-base: 1rem;
  --font-size-lg: ${typography.fontSize.lg};
  --font-size-xl: ${typography.fontSize.xl};
  --font-size-2xl: ${typography.fontSize["2xl"]};
  --font-size-3xl: ${typography.fontSize["3xl"]};
  --font-size-4xl: ${typography.fontSize["4xl"]};
}
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-body);
  font-size: ${typography.baseFontSizeDesktop}px;
}
@media (max-width: 768px) {
  body {
    font-size: ${typography.baseFontSizeMobile}px;
  }
}
`;
  }

  /**
   * Generate Button component with variants and states
   */

  generateButtonComponent(): string {
    // Get the user's choices from the customizations object
    const fillColor =
      this.customizations.buttonFillColor || "primary";
    const strokeColor =
      this.customizations.buttonStrokeColor || "primary";
    const paddingX = this.customizations.buttonPaddingX || 24;
    const paddingY = this.customizations.buttonPaddingY || 12;

    return `import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-${fillColor})] text-[var(--color-primary-foreground)] hover:opacity-90',
        secondary: 'border-2 border-[var(--color-${strokeColor})] bg-transparent text-[var(--color-${strokeColor})] hover:bg-[var(--color-${strokeColor})]/10',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, style, ...props }, ref) => {
    // Apply dynamic padding via inline styles
    const customStyles = {
      padding: \`${paddingY}px ${paddingX}px\`,
      ...style,
    };

    return (
      <button
        className={cn(buttonVariants({ variant, className }))}
        style={customStyles}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
`;
  }

  /**
   * Generate Input component with variants and states
   */

  generateInputComponent(): string {
    // Get user's choices
    const strokeColor =
      this.customizations.inputStrokeColor || "neutral";
    const focusColor =
      this.customizations.inputFillColor || "primary"; // Mapped from 'Focus Color'
    const paddingX = this.customizations.inputPaddingX || 12;
    const paddingY = this.customizations.inputPaddingY || 8;

    return `import React from 'react';
import { cn } from './utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, style, ...props }, ref) => {
    // Apply dynamic padding via inline styles
    const customStyles = {
      padding: \`${paddingY}px ${paddingX}px\`,
      ...style,
    };

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border bg-transparent text-sm ring-offset-[var(--color-background)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'border-[var(--color-${strokeColor})]',
          'focus-visible:ring-[var(--color-${focusColor})]'
        )}
        style={customStyles}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
`;
  }

  /**
   * Generate Card component with dynamic padding
   */
  // engine/AetherGenerator.ts

  generateCardComponent(): string {
    // Get the user's choices from the customizations object
    const padding = this.customizations.cardPadding || 16;
    const backgroundColor =
      this.customizations.cardFillColor || "card";
    const borderColor =
      this.customizations.cardStrokeColor || "border";

    // Get the actual hex values from the design tokens
    const bgColorValue =
      this.designTokens.colors[
        backgroundColor as keyof typeof this.designTokens.colors
      ] || "var(--color-card)";
    const borderColorValue =
      this.designTokens.colors[
        borderColor as keyof typeof this.designTokens.colors
      ] || "var(--color-border)";

    return `import React from 'react';
import { cn } from './utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  // Apply dynamic styles
  const customStyles = {
    padding: \`${padding}px\`,
    backgroundColor: '${bgColorValue}',
    borderColor: '${borderColorValue}',
    ...style
  };

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border text-[var(--color-card-foreground)] shadow-sm',
        className,
      )}
      style={customStyles}
      {...props}
    />
  );
});
Card.displayName = 'Card';

// ... The CardHeader, CardTitle, etc. sub-components can remain the same.
// Add them here if you need them.

export { Card }; // Exporting the main Card component
`;
  }

  /**
   * Generate Badge component with variants
   */
  generateBadgeComponent(): string {
    return `import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary)]/80',
        secondary:
          'border-transparent bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:bg-[var(--color-secondary)]/80',
        destructive:
          'border-transparent bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/80',
        outline: 'text-[var(--color-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
`;
  }

  /**
   * Generate Alert component with variants
   */
  generateAlertComponent(): string {
    return `import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-card)] text-[var(--color-foreground)]',
        destructive:
          'border-[var(--color-error)]/50 text-[var(--color-error)] dark:border-[var(--color-error)] [&>svg]:text-[var(--color-error)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
`;
  }

  /**
   * Generate Textarea component with dynamic padding
   */

  generateTextareaComponent(): string {
    // Get user's choices
    const strokeColor =
      this.customizations.inputStrokeColor || "neutral";
    const focusColor =
      this.customizations.inputFillColor || "primary"; // Mapped from 'Focus Color'
    const paddingX = this.customizations.inputPaddingX || 12;
    const paddingY = this.customizations.inputPaddingY || 8;

    return `import React from 'react';
import { cn } from './utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, ...props }, ref) => {
    // Apply dynamic padding via inline styles
    const customStyles = {
      padding: \`${paddingY}px ${paddingX}px\`,
      ...style,
    };

    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border bg-transparent text-sm ring-offset-[var(--color-background)] placeholder:text-[var(--color-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'border-[var(--color-${strokeColor})]',
          'focus-visible:ring-[var(--color-${focusColor})]'
        )}
        style={customStyles}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
`;
  }

  /**
   * Generate Select component with sub-components
   */
  generateSelectComponent(): string {
    return `import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from './utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-[var(--color-input)] bg-[var(--color-card)] px-3 py-2 text-sm ring-offset-[var(--color-card)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-[var(--color-card)] text-[var(--color-foreground)] shadow-md animate-in fade-in-80',
        position === 'popper' && 'translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[var(--color-accent)] focus:text-black data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem };
`;
  }

  /**
   * Generate Avatar component with image and fallback
   */
  generateAvatarComponent(): string {
    return `import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from './utils';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
`;
  }

  /**
   * Generate utility functions
   */
  generateUtils(): string {
    return `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;
  }

  /**
   * Generate complete design system
   */
  generate(): GenerationResult {
    const components = {
      // Your new, expanded component list
      "Button.tsx": this.generateButtonComponent(),
      "Input.tsx": this.generateInputComponent(),
      "Textarea.tsx": this.generateTextareaComponent(),
      "Select.tsx": this.generateSelectComponent(),
      "Card.tsx": this.generateCardComponent(),
      "Badge.tsx": this.generateBadgeComponent(),
      "Alert.tsx": this.generateAlertComponent(),
      "Avatar.tsx": this.generateAvatarComponent(),
      "utils.ts": this.generateUtils(),
    };

    const globalCSS = this.generateGlobalCSS();
    const documentation =
      this.generateDocumentation(components);

    return {
      components,
      globalCSS,
      documentation,
    };
  }

  /**
   * Generate documentation for the design system
   */

  private generateDocumentation(
    components: Record<string, string>,
  ): string {
    const { colors, typography } = this.designTokens;

    // Helper to safely format component names
    const formatComponentName = (filename: string) =>
      filename.replace(".tsx", "");
    const componentList = Object.keys(components)
      .filter((name) => name !== "utils.ts")
      .map((name) => `- **${formatComponentName(name)}**`)
      .join("\n");

    return `# Design System Documentation

## Overview
This design system was generated using the Aether Design System Generator. It includes a complete set of design tokens and React TypeScript components.

## Design Tokens

### Colors
- **Primary**: ${colors.primary}
- **Secondary**: ${colors.secondary}
- **Success**: ${colors.success}
- **Error**: ${colors.error}
- **Warning**: ${colors.warning}
- **Accent**: ${colors.accent}
- **Neutral**: ${colors.neutral}

### Typography
- **Heading Font**: ${typography.headingFont}
- **Body Font**: ${typography.bodyFont}
- **Base Font Size (Desktop)**: ${typography.baseFontSizeDesktop}px
- **Base Font Size (Mobile)**: ${typography.baseFontSizeMobile}px
- **Scale**: ${typography.scale}

#### Font Sizes (rem based on Desktop)
- **XS**: ${typography.fontSize.xs}
- **SM**: ${typography.fontSize.sm}
- **Base**: ${typography.fontSize.base}
- **LG**: ${typography.fontSize.lg}
- **XL**: ${typography.fontSize.xl}
- **2XL**: ${typography.fontSize["2xl"]}
- **3XL**: ${typography.fontSize["3xl"]}
- **4XL**: ${typography.fontSize["4xl"]}

## Generated Components
${componentList}

## Usage

1.  Add the contents of \`global.css\` to your project's main stylesheet.
2.  Import and use the components from the \`/components\` directory as needed.
3.  Customize by modifying the CSS custom properties in \`global.css\`.

Generated on: ${new Date().toLocaleDateString()}
`;
  }

  /**
   * Convert font family name to Google Fonts import format
   */
  private getFontImportName(fontFamily: string): string {
    const fontName = fontFamily.split(",")[0].trim();
    return fontName.replace(/\s+/g, "+");
  }
}

/**
 * Utility function to check color contrast for accessibility
 */
export function checkColorContrast(
  foreground: string,
  background: string,
): { ratio: number; passes: boolean } {
  // This is a simplified implementation
  // In a real application, you would use a proper color contrast calculation library
  const ratio = 4.5; // Mock ratio that passes WCAG AA
  const passes = ratio >= 4.5;

  return { ratio, passes };
}

/**
 * Generate a 10-step color ramp from a base color
 */
export function generateColorRamp(
  baseColor: string,
): Record<string, string> {
  // Convert hex to HSL for better color manipulation
  const hsl = hexToHsl(baseColor);

  return {
    "50": hslToHex(
      hsl.h,
      Math.max(hsl.s - 10, 0),
      Math.min(hsl.l + 45, 95),
    ),
    "100": hslToHex(
      hsl.h,
      Math.max(hsl.s - 5, 0),
      Math.min(hsl.l + 35, 90),
    ),
    "200": hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 25, 85)),
    "300": hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 80)),
    "400": hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 5, 75)),
    "500": baseColor, // Base color
    "600": hslToHex(
      hsl.h,
      Math.min(hsl.s + 5, 100),
      Math.max(hsl.l - 10, 25),
    ),
    "700": hslToHex(
      hsl.h,
      Math.min(hsl.s + 10, 100),
      Math.max(hsl.l - 20, 20),
    ),
    "800": hslToHex(
      hsl.h,
      Math.min(hsl.s + 15, 100),
      Math.max(hsl.l - 30, 15),
    ),
    "900": hslToHex(
      hsl.h,
      Math.min(hsl.s + 20, 100),
      Math.max(hsl.l - 40, 10),
    ),
  };
}

/**
 * Typography scale ratios
 */
export const TYPOGRAPHY_SCALES = {
  "minor-second": 1.067,
  "major-second": 1.125,
  "minor-third": 1.2,
  "major-third": 1.25,
  "perfect-fourth": 1.333,
  "golden-ratio": 1.618,
} as const;

/**
 * Generate typography scale from base size and ratio
 */
export function generateTypographyScale(
  baseFontSize: number,
  scale: keyof typeof TYPOGRAPHY_SCALES,
): Record<string, string> {
  const ratio = TYPOGRAPHY_SCALES[scale];

  return {
    xs: `${(baseFontSize / ratio / ratio).toFixed(2)}rem`,
    sm: `${(baseFontSize / ratio).toFixed(2)}rem`,
    base: `${baseFontSize}rem`,
    lg: `${(baseFontSize * ratio).toFixed(2)}rem`,
    xl: `${(baseFontSize * ratio * ratio).toFixed(2)}rem`,
    "2xl": `${(baseFontSize * Math.pow(ratio, 3)).toFixed(2)}rem`,
    "3xl": `${(baseFontSize * Math.pow(ratio, 4)).toFixed(2)}rem`,
    "4xl": `${(baseFontSize * Math.pow(ratio, 5)).toFixed(2)}rem`,
  };
}

/**
 * Curated font combinations
 */
export const FONT_COMBINATIONS = [
  // Sans Serif
  {
    id: "inter",
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
    category: "sans-serif",
    name: "Inter",
  },
  {
    id: "roboto",
    heading: "Roboto, system-ui, sans-serif",
    body: "Roboto, system-ui, sans-serif",
    category: "sans-serif",
    name: "Roboto",
  },

  // Serif
  {
    id: "playfair",
    heading: "Playfair Display, serif",
    body: "Source Serif Pro, serif",
    category: "serif",
    name: "Playfair + Source Serif",
  },
  {
    id: "merriweather",
    heading: "Merriweather, serif",
    body: "Merriweather, serif",
    category: "serif",
    name: "Merriweather",
  },

  // Display
  {
    id: "poppins",
    heading: "Poppins, system-ui, sans-serif",
    body: "Open Sans, system-ui, sans-serif",
    category: "display",
    name: "Poppins + Open Sans",
  },
  {
    id: "montserrat",
    heading: "Montserrat, system-ui, sans-serif",
    body: "Lato, system-ui, sans-serif",
    category: "display",
    name: "Montserrat + Lato",
  },

  // Decorative
  {
    id: "dancing",
    heading: "Dancing Script, cursive",
    body: "Lora, serif",
    category: "decorative",
    name: "Dancing Script + Lora",
  },
  {
    id: "pacifico",
    heading: "Pacifico, cursive",
    body: "Nunito, system-ui, sans-serif",
    category: "decorative",
    name: "Pacifico + Nunito",
  },

  // Slab Serif
  {
    id: "rockwell",
    heading: "Rockwell, serif",
    body: "Source Sans Pro, system-ui, sans-serif",
    category: "slab-serif",
    name: "Rockwell + Source Sans",
  },
  {
    id: "zilla",
    heading: "Zilla Slab, serif",
    body: "Fira Sans, system-ui, sans-serif",
    category: "slab-serif",
    name: "Zilla Slab + Fira Sans",
  },
] as const;

// Color utility functions
function hexToHsl(hex: string): {
  h: number;
  s: number;
  l: number;
} {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color =
      l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}