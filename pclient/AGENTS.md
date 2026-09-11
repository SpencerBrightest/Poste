# Poste frontend agent instructions

Before making frontend changes, read the shared instructions in `../.agents/context/AGENTS.md` and its referenced context files, especially `../.agents/context/design-system.md`.

The shared design system is the source of truth for colors, typography, spacing, responsive behavior, elevation, shapes, and component styling. Do not edit `components/ui/*`, generated UI components, or any path matching `component/generate/ui*` unless the user explicitly requests it. Use app-level components for project-specific UI and `lucide-react` for interface icons.
