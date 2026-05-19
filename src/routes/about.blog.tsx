import { createFileRoute } from "@tanstack/react-router";
import { Route as BlogRoute } from "./blog";
export const Route = createFileRoute("/about/blog")({ component: BlogRoute.options.component!, head: BlogRoute.options.head });
