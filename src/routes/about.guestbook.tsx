import { createFileRoute } from "@tanstack/react-router";
import GuestbookRoute from "./guestbook";
export const Route = createFileRoute("/about/guestbook")(GuestbookRoute as any);
