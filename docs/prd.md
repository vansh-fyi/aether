Aether Design System Generator Product Requirements Document (PRD)
==================================================================

Goals and Background Context
----------------------------

### Goals

-   **Win the Makeathon**: Be selected as a winning submission by the judges by excelling in creativity, innovation, and cleverness.

-   **Demonstrate a Novel Workflow**: Clearly showcase an innovative application of Figma Make that solves a real-world problem for designers and developers.

-   **Deliver a Polished Demo**: Create a compelling and functional prototype of the core MVP workflow within the 48-hour timeframe, free of significant bugs.

### Background Context

Modern AI-powered design tools like Figma Make introduce a new "prompt first" paradigm that can be disorienting for designers accustomed to a more systematic workflow of manually defining design tokens and creating component libraries. This shift creates a "cold start" problem, hindering adoption and making designers feel a loss of control.

The "Aether Design System Generator" addresses this workflow gap by hyper-accelerating the familiar first step: it automates the creation of foundational components and global CSS based on a designer's inspiration. By providing ready-to-use, themed React/TypeScript (`.tsx`) code components for direct use in Figma Make, the tool makes the AI-powered creation process feel more intuitive and familiar. This empowers designers to confidently adopt these powerful new tools, starting from a structured foundation rather than a blank canvas.

### Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| Sep 09, 2025 | 1.0 | Initial PRD draft from Project Brief | John (PM) |

* * * * *

Requirements
------------

### Functional

1.  **FR1 (Modified)**: The application must provide two distinct user workflows: an **AI-Powered Path** where the application either uses a pre-configured backend API key or prompts the user to provide their own, and a **Pre-defined Path** allowing users to select from curated design system "personas".

2.  **FR2 (Revised)**: The AI-Powered Path must support user input by allowing the upload of a single JPEG or PNG image export of their moodboard.

3.  **FR3 (Replaced)**: The application must feature a guided, interactive UI for system generation that follows a sequential, step-by-step process.

    -   **3.1 Sequential Unlocking**: UI customization sections (e.g., Color, Typography, Components) must unlock one by one.

    -   **3.2 Iterative Selection**: For each step, the user must have the option to accept the AI-generated suggestion or re-generate it.

    -   **3.3 Customization Flow**: The selection process must follow a specific order: 1st Color Palette, 2nd Typography, 3rd a core component set (**Button, Input Field, Checkbox, Link**).

    -   **3.4 Live Preview Pane**: A live preview template must be displayed on the page, updating in real-time as the user makes selections.

    -   **3.5 Preview Content & Modes**: The preview must showcase the design system applied to standard layouts (e.g., a page hero, a dashboard, a form) and be toggled between desktop/mobile views and light/dark modes.

    -   **3.6 Interactive Adjustments**: The user must be able to lock in preferred selections and adjust options, with changes reflected in the live preview.

4.  **FR4 (Revised)**: The selection UI must include a built-in accessibility check for **color contrast**.

5.  **FR5**: The final output must include downloadable, themed React/TypeScript (`.tsx`) component files.

6.  **FR6 (Revised)**: The final output must include a basic, downloadable handoff documentation **Markdown file** that summarizes the selected design tokens.

7.  **FR7**: The application must include a feature to generate a design system based on the merging of two contradictory themes ("Chaos Mode").

8.  **FR8 (Revised)**: Generated `.tsx` files must be able to be dragged into a new Figma Make file, be immediately rendered, and respond to a basic modification prompt.

9.  **FR9 (New)**: If the user chooses the AI-Powered Path but a key is not provided, the application must prompt them to acquire one from Google AI Studio, providing a direct link.

10. **FR10 (New)**: The typography selection step must allow the user to choose a font from a pre-defined list and select a spacing preset.

### Non Functional

1.  **NFR1 (Revised)**: The core user workflow, measured from the moment a user uploads an asset to the moment the download links are available, must take less than 5 minutes.

2.  **NFR2**: The application must be a responsive web app, accessible on modern desktop and mobile browsers.

3.  **NFR3**: The frontend web application must be hosted on Figma Sites.

4.  **NFR4**: A serverless Node.js backend is required for secure API key interactions (if implemented).

5.  **NFR5 (Revised)**: For the Makeathon demo, the LLM API key will be handled on the client-side with the explicit understanding that this is an insecure shortcut. A secure, serverless backend is a top priority for any post-MVP development.

6.  **NFR6**: All tools and services used must have a free tier sufficient for the hackathon.

7.  **NFR7**: The prototype must be able to use a pre-cached successful LLM API response as a fallback for the demo.

* * * * *

User Interface Design Goals
---------------------------

### Overall UX Vision

The overall UX vision is to provide a seamless and rapid on-ramp for designers into a code-first AI workflow. The tool should feel empowering, giving the user a strong sense of creative control while automating the tedious manual setup of components.

### Key Interaction Paradigms

-   **Sequential Guided Flow**: The user will be guided through a linear, step-by-step process where customization sections unlock sequentially.

-   **Live Interactive Preview**: All user selections will be reflected in real-time in a comprehensive preview pane, providing immediate feedback.

-   **Iterative Generation**: At key steps, the user will have the option to re-generate the AI's suggestions until they are satisfied.

### Core Screens and Views

The application will function as a **single-page application** that transitions between three primary states: **1\. Input State** (where the user provides assets), **2\. Generator State** (the main interactive UI), and **3\. Completion State** (where download links are provided).

### Accessibility

The application's **output** will adhere to accessibility standards. The built-in color contrast checker (`FR4`) will ensure that all generated color combinations meet a minimum of WCAG 2.1 Level AA compliance.

### Branding

The branding for "Aether" should be clean and minimalist, primarily using a **monochrome color scheme for the tool's own UI**. This ensures the design system being generated in the preview is always the primary visual focus.

### Target Device and Platforms: Web Responsive

The application will be a responsive web app. To accommodate smaller viewports, the layout will shift from a two-column (side-by-side controls and preview) on desktop to a single-column (controls on top, preview on bottom) on mobile.

* * * * *

Technical Assumptions
---------------------

### Repository Structure

Two separate repositories (one for the frontend application, one for supporting files/backend if needed).

### Service Architecture

**None (for MVP)**. The frontend will make direct, client-side calls to the external Google AI API.

### Testing Requirements

The testing strategy will focus on **Unit Tests** plus a **key integration test** for the client-side API call to the external LLM.

### Additional Technical Assumptions and Requests

-   **Frontend Language/Framework**: React with TypeScript.

-   **Hosting**: The frontend web application will be hosted on Figma Sites.

* * * * *

Epic 1: Aether Design System Generator MVP
------------------------------------------

**Goal**: The primary goal of this epic is to deliver a complete, end-to-end, and demonstrable prototype for the Figma Makeathon. It will encompass the entire user journey, from providing an inspirational asset to downloading a functional, themed set of React components.

### Stories

**Story 1.1: Project Scaffolding & Welcome UI**

-   **As a** user, **I want** to see the welcome screen and have a clear option to upload my inspirational asset, **so that** I can begin the design system generation process.

-   **Acceptance Criteria**:

    1.  A new React + TypeScript project is created and configured.

    2.  The application displays a welcome message and a title.

    3.  A unified "Upload Asset" area is visible, allowing the user to upload a single JPEG or PNG image.

    4.  A section for selecting pre-defined "personas" is visible.

**Story 1.2: Interactive Selection UI & Live Preview Shell**

-   **As a** user, **I want** to see the interactive generator layout with a live preview area, **so that** I can understand the steps involved and see where my design system will appear.

-   **Acceptance Criteria**:

    1.  After providing an asset, the UI transitions to the generator state.

    2.  A two-column layout is displayed.

    3.  The controls column contains disabled containers for "Color Palette," "Typography," and "Components."

    4.  The preview column contains a placeholder layout and toggles for light/dark mode and desktop/mobile view.

**Story 1.3: AI-Powered Color Palette Generation & Application**

-   **As a** user, **I want** the tool to analyze my inspiration and generate a color palette, **so that** my design system has a thematic foundation.

-   **Acceptance Criteria**:

    1.  The UI prompts for an LLM API key.

    2.  After submitting an asset, a loading indicator appears, followed by the display of a generated color palette.

    3.  The live preview pane immediately updates to reflect the new color palette.

    4.  A "Re-generate" button is available.

    5.  Upon accepting the colors, the "Typography" section is unlocked.

**Story 1.4: Typography & Spacing Selection**

-   **As a** user, **I want** to select a font and a spacing preset, **so that** I can define the typographic scale of my design system.

-   **Acceptance Criteria**:

    1.  The "Typography" section contains a dropdown to select a font and options to select a spacing preset.

    2.  The selection immediately updates the live preview.

    3.  Upon accepting the typography, the "Components" section is unlocked.

**Story 1.5: Component Customization UI**

-   **As a** user, **I want** to see and adjust minor options for my generated components, **so that** I can fine-tune the final output.

-   **Acceptance Criteria**:

    1.  The "Components" section displays customization controls for the core components (Button, Input Field, Checkbox, Link).

    2.  Adjusting a control (e.g., button padding) updates that component in the live preview.

**Story 1.6: Theme-to-Code Generation Engine**

-   **As a** developer, **I need** a function that takes the final design tokens and returns strings of `.tsx` code, **so that** the user's choices are translated into components.

-   **Acceptance Criteria**:

    1.  A function accepts a token object (colors, fonts, etc.) as input.

    2.  The function returns an array of strings, with each string containing valid `.tsx` code for a component.

    3.  The generated code is syntactically correct.

**Story 1.7: Asset Packaging & Download**

-   **As a** user, **I want** to download a single ZIP file containing all my generated component files, **so that** I can easily import them into my project.

-   **Acceptance Criteria**:

    1.  A "Generate Final Assets" button is available.

    2.  Clicking the button takes the generated code strings, creates a ZIP file, and initiates a browser download.

**Story 1.8: Documentation Handoff**

-   **As a** user, **I want** to download a summary of my design choices, **so that** I have a record of my design tokens.

-   **Acceptance Criteria**:

    1.  The completion state provides a download link for a `handoff.md` file summarizing the selected tokens.

**Story 1.9: Chaos Mode**

-   **As a** user, **I want** to try "Chaos Mode" for creative inspiration, **so that** I can explore unique designs.

-   **Acceptance Criteria**:

    1.  A "Chaos Mode" option on the welcome screen allows the selection of two personas to merge.

    2.  The generation process uses the merged theme.

* * * * *
