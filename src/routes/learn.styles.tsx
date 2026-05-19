import { createFileRoute } from "@tanstack/react-router";
import { Route as StylesRoute } from "./styles";
export const Route = createFileRoute("/learn/styles")({ component: StylesRoute.options.component!, head: StylesRoute.options.head });
