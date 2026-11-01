import type { TemplateDefinition } from "./types";
import { formalFeeCentered } from "./formal-fee-centered";
import { formalFeeHeader } from "./formal-fee-header";

// To add a template: create its folder (manifest + component) and add one line here.
export const templates: TemplateDefinition[] = [formalFeeHeader, formalFeeCentered];

export const getTemplate = (id: string) => templates.find((t) => t.manifest.id === id);