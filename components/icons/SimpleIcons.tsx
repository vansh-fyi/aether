import React from 'react';

// Simple SVG-based icons to completely replace lucide-react
export const BrainIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M12 2C8 2 5 5 5 9v6c0 4 3 7 7 7s7-3 7-7V9c0-4-3-7-7-7z"/>
      <path d="M8 12h8"/>
      <path d="M8 16h8"/>
    </svg>
  )
);
BrainIcon.displayName = "BrainIcon";

export const PaletteIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <circle cx="13.5" cy="6.5" r=".5"/>
      <circle cx="17.5" cy="10.5" r=".5"/>
      <circle cx="8.5" cy="7.5" r=".5"/>
      <circle cx="6.5" cy="12.5" r=".5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  )
);
PaletteIcon.displayName = "PaletteIcon";

export const ZapIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
    </svg>
  )
);
ZapIcon.displayName = "ZapIcon";

export const ShuffleIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <polyline points="16,3 21,3 21,8"/>
      <line x1="4" y1="20" x2="21" y2="3"/>
      <polyline points="21,16 21,21 16,21"/>
      <line x1="15" y1="15" x2="21" y2="21"/>
      <line x1="4" y1="4" x2="9" y2="9"/>
    </svg>
  )
);
ShuffleIcon.displayName = "ShuffleIcon";

export const SparklesIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  )
);
SparklesIcon.displayName = "SparklesIcon";

export const ImagesIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M18 22H4a2 2 0 0 1-2-2V6"/>
      <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/>
      <circle cx="12" cy="8" r="2"/>
      <rect width="16" height="16" x="6" y="2" rx="2"/>
    </svg>
  )
);
ImagesIcon.displayName = "ImagesIcon";

export const XIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
);
XIcon.displayName = "XIcon";

export const ArrowLeftIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12,19 5,12 12,5"/>
    </svg>
  )
);
ArrowLeftIcon.displayName = "ArrowLeftIcon";

export const ArrowRightIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12,5 19,12 12,19"/>
    </svg>
  )
);
ArrowRightIcon.displayName = "ArrowRightIcon";

export const CheckIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  )
);
CheckIcon.displayName = "CheckIcon";

export const SunIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/>
      <path d="M12 20v2"/>
      <path d="m4.93 4.93 1.41 1.41"/>
      <path d="m17.66 17.66 1.41 1.41"/>
      <path d="M2 12h2"/>
      <path d="M20 12h2"/>
      <path d="m6.34 17.66-1.41 1.41"/>
      <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  )
);
SunIcon.displayName = "SunIcon";

export const MoonIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  )
);
MoonIcon.displayName = "MoonIcon";

export const MonitorIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <rect width="20" height="14" x="2" y="3" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  )
);
MonitorIcon.displayName = "MonitorIcon";

export const SmartphoneIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  )
);
SmartphoneIcon.displayName = "SmartphoneIcon";

export const TypeIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <polyline points="4,7 4,4 20,4 20,7"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
      <line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  )
);
TypeIcon.displayName = "TypeIcon";

export const ComponentIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"/>
      <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"/>
      <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"/>
      <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"/>
    </svg>
  )
);
ComponentIcon.displayName = "ComponentIcon";

export const DownloadIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7,10 12,15 17,10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
);
DownloadIcon.displayName = "DownloadIcon";

export const FileTextIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  )
);
FileTextIcon.displayName = "FileTextIcon";

export const PackageIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="m7.5 4.27 9 5.15"/>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  )
);
PackageIcon.displayName = "PackageIcon";

export const CheckCircleIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22,4 12,14.01 9,11.01"/>
    </svg>
  )
);
CheckCircleIcon.displayName = "CheckCircleIcon";

export const RefreshCwIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M3 21v-5h5"/>
    </svg>
  )
);
RefreshCwIcon.displayName = "RefreshCwIcon";

export const KeyIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <circle cx="7.5" cy="15.5" r="5.5"/>
      <path d="m21 2-9.6 9.6"/>
      <path d="m15.5 7.5 3 3L22 7l-3-3"/>
    </svg>
  )
);
KeyIcon.displayName = "KeyIcon";

export const ExternalLinkIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>
  )
);
ExternalLinkIcon.displayName = "ExternalLinkIcon";

export const AlertTriangleIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
);
AlertTriangleIcon.displayName = "AlertTriangleIcon";

export const InfoIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<'svg'>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      className={className} 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  )
);
InfoIcon.displayName = "InfoIcon";