import { createFileRoute } from "@tanstack/react-router";
import BlogRoute from "./blog";
export const Route = createFileRoute("/about/blog")(BlogRoute as any);
