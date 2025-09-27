import { calculateFontSizeObject } from "../store/useDesignSystemStore";

export interface GeminiRequest {
  apiKey: string;
  imageData: string[]; // CHANGED: Now an array of strings
  prompt: string;
}

export interface GeminiResponse {
  designTokens: {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      error: string;
      warning: string;
      accent: string;
      neutral: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
      baseFontSize: string;
      scale:
      | "minor-second"
      | "major-second"
      | "minor-third"
      | "major-third"
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
    };
  };
  components: string[];
}

export class GeminiClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "GeminiClientError";
  }
}

/**
 * Pre-cached fallback response for demo purposes
 * Used when API fails or for offline demonstrations
 */
const FALLBACK_RESPONSE: GeminiResponse = {
  designTokens: {
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      success: "#059669",
      error: "#dc2626",
      warning: "#d97706",
      accent: "#f59e0b",
      neutral: "#374151",
    },
    typography: {
      headingFont: "Inter, system-ui, sans-serif",
      bodyFont: "Inter, system-ui, sans-serif",
      baseFontSize: "16px",
      scale: "major-third",
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
      },
    },
  },
  components: ["Button", "Input", "Checkbox", "Link"],
};

/**
 * Aether's API key from environment variables
 */
const AETHER_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Get the API key to use for requests
 */
export function getEffectiveApiKey(
  userApiKey: string | null,
): string | null {
  if (!userApiKey || userApiKey === "YOUR_API_KEY_HERE") {
    return null; // No valid API key provided
  }

  if (userApiKey === "AETHER_MODEL") {
    return AETHER_API_KEY; // Use Aether's model
  }

  return userApiKey; // Use user's provided API key
}

/**
 * Client service for interacting with Google AI Gemini API
 * Handles image analysis and design token generation with robust error handling
 */
// services/geminiClient.ts
type Part =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export async function generateDesignSystem(
  request: GeminiRequest,
): Promise<GeminiResponse> {
  const effectiveApiKey = getEffectiveApiKey(request.apiKey);

  // If there is no valid API key, immediately use the fallback.
  if (!effectiveApiKey) {
    console.warn(
      "No valid API key found. Using fallback response.",
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate a brief delay
    return FALLBACK_RESPONSE;
  }

  // Determine which model to use based on the presence of image data
  const isVisionRequest =
    !!request.imageData && request.imageData.length > 0;
  const model = isVisionRequest
    ? "gemini-2.0-flash"
    : "gemini-2.0-flash";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveApiKey}`;

  try {
    console.log(
      `Making live API call to ${model} with ${effectiveApiKey === AETHER_API_KEY ? "Aether's Model" : "User's API Key"}...`,
    );

    // FIXED: Apply the new 'Part' type to the array
    const parts: Part[] = [{ text: request.prompt }];

    // CHANGED: Loop through all images and add them to the request
    if (isVisionRequest) {
      request.imageData.forEach((imgData) => {
        parts.push({
          inlineData: {
            mimeType: "image/png", // Assuming PNG, adjust if needed
            data: imgData,
          },
        });
      });
    }
    const requestBody = {
      contents: [{ parts }],
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_ONLY_HIGH",
        },
      ],
      generationConfig: {
        temperature: 0.5,
        topP: 1,
        topK: 32,
        maxOutputTokens: 4096,
      },
    };

    // Add timeout handling to prevent long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      60000,
    ); // CHANGED: 60 second timeout

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google AI API Error Response:", errorData);
      throw new GeminiClientError(
        `API request failed with status ${response.status}`,
        response.status,
      );
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      console.error("API response missing candidates:", data);
      throw new Error(
        "Invalid API response format: No candidates found.",
      );
    }

    // Clean and parse the JSON response from the AI
    const jsonString = data.candidates[0].content.parts[0].text
      .replace(/```json/g, "")
      .replace(/```/g, "");

    const parsedResponse = JSON.parse(jsonString);
    console.log("Parsed AI Response Object:", parsedResponse);

    if (
      parsedResponse.designTokens &&
      !parsedResponse.designTokens.typography.fontSize
    ) {
      console.warn(
        "AI response was missing 'fontSize' object. Calculating it now.",
      );
      const { scale, baseFontSizeDesktop } =
        parsedResponse.designTokens.typography;
      parsedResponse.designTokens.typography.fontSize =
        calculateFontSizeObject(scale, baseFontSizeDesktop);
    }

    // services/geminiClient.ts -> at the end of the 'try' block

    if (!parsedResponse.designTokens) {
      throw new Error(
        "Parsed API response is missing the required 'designTokens' field.",
      );
    }

    // If the AI forgets the static component list, add it back in.
    if (!parsedResponse.components) {
      console.warn(
        "AI response was missing 'components' array. Defaulting to standard list.",
      );
      parsedResponse.components = [
        "Button",
        "Input",
        "Checkbox",
        "Link",
      ];
    }

    return parsedResponse as GeminiResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `Gemini API timeout (${model} model): Request took longer than 15 seconds`,
      );
    } else {
      console.error(
        `Gemini API error (${model} model):`,
        error,
      );
    }
    console.warn(
      "Falling back to cached response due to API error",
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    return FALLBACK_RESPONSE;
  }
}

/**
 * Validate API key format (basic client-side validation)
 */
export function validateApiKey(apiKey: string): {
  valid: boolean;
  message: string;
} {
  if (!apiKey) {
    return { valid: false, message: "API key is required" };
  }

  if (apiKey === "YOUR_API_KEY_HERE") {
    return {
      valid: false,
      message: "Please provide your actual API key",
    };
  }

  // Allow AETHER_MODEL as a special case
  if (apiKey === "AETHER_MODEL") {
    return { valid: true, message: "Using Aether's model" };
  }

  if (apiKey.length < 10) {
    return {
      valid: false,
      message: "API key appears to be too short",
    };
  }

  return { valid: true, message: "API key format looks valid" };
}

/**
 * Get Google AI Studio URL for API key acquisition
 */
export function getApiKeyUrl(): string {
  return "https://makersuite.google.com/app/apikey";
}

/**
 * Convert File to base64 string for API transmission
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just the base64 data
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Convert multiple Files to base64 strings for API transmission
 */
export async function filesToBase64(
  files: File[],
): Promise<string[]> {
  const promises = files.map((file) => fileToBase64(file));
  return Promise.all(promises);
}