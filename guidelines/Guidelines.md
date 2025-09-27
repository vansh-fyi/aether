# Core Directives: The Single Source of Truth

**CRITICAL:** Your primary goal is to generate code that strictly adheres to the specifications and architecture defined in the `/docs` directory. Before generating any code, you must consult these documents. If there is a conflict between documents, the more specific document (e.g., `ui-architecture.md`) overrides the more general one (e.g., `project-brief.md`).

The authoritative documents are:

1.  **/docs/project-brief.md**: Use this for the **"WHY"**. It contains the high-level vision, problem statement, and target user personas.
2.  **/docs/prd.md**: Use this for the **"WHAT"**. It contains the detailed functional requirements, user stories, and MVP scope.
3.  **/docs/ui-ux-specifications.md**: Use this for the **"LOOK AND FEEL"**. It contains the user flows, wireframes, component variants, and the logic for the style guide generation (color ramps, typography scales).
4.  **/docs/ui-architecture.md**: Use this for the **"HOW"**. It is the definitive technical blueprint. It contains the required technology stack, project folder structure, component patterns, and coding standards.

---

# General Guidelines

- Always generate responsive layouts using **flexbox and grid**. Avoid absolute positioning unless specified.
- Generated code must adhere to the folder structure defined in `/docs/ui-architecture.md`.
- Keep functions and components focused on a single responsibility. Helper functions and sub-components should be organized logically.
- All generated components must be fully typed using **TypeScript**.

---

# Design System & Component Guidelines

Your primary directive is to generate components that follow the **`shadcn/ui`** model, as detailed in the architecture document.

- **Foundation**: Components should be built using accessible, unstyled primitives (like those from Radix UI).
- **Styling**: All styling **MUST** be done using **Tailwind CSS** utility classes. Do not generate custom CSS files for individual components.
- **Theming**: All colors, fonts, and radii **MUST** be applied using the CSS Custom Properties (variables) defined in `/src/styles/globals.css`.
- **Variants**: Component variants (e.g., primary vs. secondary buttons) **MUST** be implemented using the `class-variance-authority` (`cva`) pattern specified in `/docs/ui-architecture.md`.
- **Component Structure**: All generated components must follow the `React.forwardRef` template defined in `/docs/ui-architecture.md`.

---