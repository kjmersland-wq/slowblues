import { createFileRoute } from "@tanstack/react-router";
import { Route as GuestbookRoute } from "./guestbook";
export const Route = createFileRoute("/about/guestbook")({ component: GuestbookRoute.options.component!, head: GuestbookRoute.options.head });
