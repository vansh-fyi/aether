import React from "react";
import { useDesignSystemStore } from "../../store/useDesignSystemStore";
import { AetherGenerator } from "../../engine/AetherGenerator";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  DownloadIcon,
  FileTextIcon,
  PackageIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  PaletteIcon,
  TypeIcon,
  ComponentIcon,
  RefreshCwIcon,
} from "../icons/SimpleIcons";


export function CompletionStateComponent() {
  const {
    designTokens,
    componentCustomizations,
    generatedComponents,
    setCurrentStep,
    resetStore,
  } = useDesignSystemStore();

  const handleDownloadComponents = async () => {
    // ADDED: A try...catch block to find the silent error
    try {
      if (!designTokens) {
        console.error(
          "Download failed: designTokens are not available.",
        );
        return;
      }

      console.log("Starting download process...");
      const generator = new AetherGenerator(
        designTokens,
        componentCustomizations,
      );
      const result = generator.generate();
      console.log("Generator finished. Preparing zip...");

      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      zip.file("global.css", result.globalCSS);
      zip.file("README.md", result.documentation);

      const componentsFolder = zip.folder("components");
      if (componentsFolder) {
        Object.entries(result.components).forEach(
          ([filename, content]) => {
            componentsFolder.file(filename, content);
          },
        );
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      console.log("Zip file created. Triggering download...");

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "aether-design-system.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("Download triggered successfully.");
    } catch (error) {
      // This will catch the hidden error and print it to the console
      console.error(
        "AN ERROR OCCURRED DURING DOWNLOAD:",
        error,
      );
    }
  };

  const handleDownloadHandoff = () => {
    if (!designTokens) return;

    // Generate comprehensive handoff documentation using AetherGenerator
    const generator = new AetherGenerator(
      designTokens,
      componentCustomizations,
    );
    const result = generator.generate();

    const blob = new Blob([result.documentation], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aether-design-system-handoff.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    resetStore();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 bg-background z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep("generator")}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Generator
              </Button>
              <div>
                <h1 className="font-semibold text-lg">
                  Design System Complete
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your custom design system is ready for
                  download
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Success Message */}
          <Card className="p-8 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircleIcon className="h-16 w-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold">
              Design System Generated Successfully!
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your custom design system has been created based
              on your moodboard and preferences. Download the
              components and documentation to start implementing
              in your project.
            </p>
          </Card>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <PaletteIcon className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">Colors</h3>
              </div>
              {designTokens && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(designTokens.colors).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: value }}
                        />
                        <span className="text-sm capitalize">
                          {key}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              )}
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <TypeIcon className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">Typography</h3>
              </div>
              {designTokens && (
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Heading Font
                    </p>
                    <p className="text-sm font-medium">
                      {
                        designTokens.typography.headingFont.split(
                          ",",
                        )[0]
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Body Font
                    </p>
                    <p className="text-sm font-medium">
                      {
                        designTokens.typography.bodyFont.split(
                          ",",
                        )[0]
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Scale
                    </p>
                    <p className="text-sm">
                      {designTokens.typography.scale}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {Object.entries(
                      designTokens.typography.fontSize,
                    )
                      .slice(0, 4)
                      .map(([size, value]) => (
                        <div
                          key={size}
                          className="flex items-center justify-between"
                        >
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {size}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <ComponentIcon className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">Components</h3>
              </div>
              <div className="space-y-2">
                {generatedComponents.map((component) => (
                  <Badge
                    key={component}
                    variant="secondary"
                    className="mr-2 mb-2"
                  >
                    {component}
                  </Badge>
                ))}
                <p className="text-xs text-muted-foreground mt-2">
                  {generatedComponents.length} components
                  generated
                </p>
              </div>
            </Card>
          </div>

          {/* Download Section */}
          <Card className="p-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center">
                Download Your Design System
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-6 border rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <PackageIcon className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-semibold">
                          Component Package
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Complete .zip file with all React
                          components
                        </p>
                      </div>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• React TypeScript components</li>
                      <li>• Tailwind CSS styles</li>
                      <li>• Component documentation</li>
                      <li>• Usage examples</li>
                    </ul>
                  </div>
                  <Button
                    onClick={handleDownloadComponents}
                    className="w-full flex items-center gap-2"
                    size="lg"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download Components (.zip)
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-6 border rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <FileTextIcon className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-semibold">
                          Design Handoff
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Documentation for developers and
                          designers
                        </p>
                      </div>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Design token specifications</li>
                      <li>• Implementation guidelines</li>
                      <li>• Color and typography details</li>
                      <li>• Component inventory</li>
                    </ul>
                  </div>
                  <Button
                    onClick={handleDownloadHandoff}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    size="lg"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    Download Handoff (.md)
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={handleStartOver}
              className="flex items-center gap-2"
            >
              <RefreshCwIcon className="h-4 w-4" />
              Create Another System
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}