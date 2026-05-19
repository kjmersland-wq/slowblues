import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/about/blog")({
  beforeLoad: () => { throw redirect({ to: "/blog" }); },
});
