import type { TemplateDefinition } from "../types";
import { manifest } from "./manifest";
import Template from "./Template";

export const formalFeeHeader: TemplateDefinition = { manifest, Component: Template };