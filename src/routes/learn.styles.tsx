import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/learn/styles")({
  beforeLoad: () => { throw redirect({ to: "/styles" }); },
});
