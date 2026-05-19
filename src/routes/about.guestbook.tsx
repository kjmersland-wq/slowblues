import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/about/guestbook")({
  beforeLoad: () => { throw redirect({ to: "/guestbook" }); },
});
