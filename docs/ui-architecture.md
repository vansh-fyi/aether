**Aether Design System Generator Frontend Architecture Document**
=================================================================

**Section 1: Template and Framework Selection**
-----------------------------------------------

The project will be built using the **Figma Make** generative AI tool. Therefore, this architecture document serves as the master blueprint for **prompting the AI and structuring the code it generates**. We are not using a traditional starter template like Vite; our "starter" is the initial output from Figma Make.

**Section 2: Frontend Tech Stack**
----------------------------------

This stack is designed for a modern, AI-generated workflow, prioritizing simplicity, performance, and a great developer experience.

| Category | Technology | Version | Purpose | Rationale |
| --- | --- | --- | --- | --- |
| **Framework** | React | 18.2.0 | Core UI library for building components. | Specified in the PRD. The industry standard. |
| **Language** | TypeScript | 5.0.2 | Adds static typing to JavaScript. | Specified in the PRD. Catches errors early and improves code quality. |
| **Component Model** | shadcn/ui | Latest | A methodology for building reusable components. | Not a dependency library. Uses Radix UI for accessibility and Tailwind for styling, matching the AI's output. |
| **Styling** | Tailwind CSS | 3.3.3 | A utility-first CSS framework. | Excellent for rapid prototyping and AI generation, as styles are co-located with markup. |
| **State Management** | Zustand | 4.4.7 | A small, fast, and scalable state-management solution. | Ideal for the MVP's state complexity without heavy boilerplate. |
| **Asset Packaging** | JSZip | 3.10.1 | A library for creating `.zip`files in the browser. | Required for packaging the generated `.tsx` files for download. |
| **Testing** | Vitest & RTL | Latest | Fast test runner and user-centric component testing library. | Modern toolchain that pairs perfectly with a Vite-like environment. |
| **Build Tool** | Figma Make | N/A | The AI-powered build and generation environment. | A core constraint of the Makeathon. |

**CRITICAL NOTE on API Keys:** As per `NFR5` in the PRD, the Makeathon MVP will handle the user's LLM API key on the **client side**. This is an explicit security shortcut for the demo. Any post-MVP version **must** include a secure, serverless backend.

**Section 3: Project Structure**
--------------------------------

This structure is designed for clarity and a clean separation of concerns, separating the application's UI, the core generation logic, and the global state.

Plaintext

**Section 4: Component Standards**
----------------------------------

These standards ensure every component is consistent, high-quality, and easy to maintain.

-   **File & Component Naming**: All files and components will use **PascalCase** (e.g., `LivePreview.tsx`).

-   **Props Interface**: Component props interfaces will use **PascalCase with a `Props` suffix** (e.g., `interface LivePreviewProps`).

-   **Component Template**: Components will follow the `shadcn/ui` model, using `React.forwardRef` and `class-variance-authority` (`cva`) to handle styles and variants.

**Section 5: State Management**
-------------------------------

We will use **Zustand** for global state management, contained within a single store at `src/store/useDesignSystemStore.ts`. This store will hold the user's selected design tokens, the current UI step, and all actions to update the state.

**Section 6: API Integration**
------------------------------

All communication with the external Google AI API will be encapsulated within the `src/services/geminiClient.ts`file. This service will use the browser's `fetch` API and include robust error handling and TypeScript interfaces for requests and responses. This isolates the API logic, making it easy to manage and migrate to a secure backend in the future.

**Section 7: Routing**
----------------------

The application will use **state-based routing**. The main `App.tsx` component will conditionally render one of the three primary views (Input, Generator, Completion) based on the `currentStep` property from the Zustand store. No external routing library is needed for the MVP.

**Section 8: Styling Guidelines**
---------------------------------

The Aether application's own UI will be styled using **Tailwind CSS** utility classes. The core theme will be a minimal, monochrome palette defined as CSS Custom Properties in `src/styles/globals.css` to avoid interfering with the live preview of the user's generated system.

**Section 9: Testing Requirements**
-----------------------------------

The testing strategy will be lean, focusing on **Unit Tests** for critical logic (especially the generation engine) and a single **Integration Test** for the `geminiClient.ts` service, mocking the API call. We will use **Vitest** and **React Testing Library**. E2E tests are out of scope for the MVP.

**Section 10: Environment Configuration**
-----------------------------------------

Environment variables will be managed in a `.env.local` file, prefixed with `VITE_` as required by Vite-based environments like Figma Make.

**Section 11: Frontend Developer Standards**
--------------------------------------------

-   **State**: Use the Zustand store for all global state.

-   **API Calls**: Use the `geminiClient.ts` service for all external API calls.

-   **Styling**: Use Tailwind CSS utility classes exclusively.

-   **Components**: Adhere to the `cva`-based component template.

* * * * *
