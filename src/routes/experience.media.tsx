import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/experience/media")({
  beforeLoad: () => { throw redirect({ to: "/listen" }); },
});
