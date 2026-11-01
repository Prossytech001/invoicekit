import type { TemplateDefinition } from "../types";
import { manifest } from "./manifest";
import Template from "./Template";

export const formalFeeCentered: TemplateDefinition = { manifest, Component: Template };