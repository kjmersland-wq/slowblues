import { createFileRoute } from "@tanstack/react-router";
import StylesRoute from "./styles";
export const Route = createFileRoute("/learn/styles")(StylesRoute as any);
