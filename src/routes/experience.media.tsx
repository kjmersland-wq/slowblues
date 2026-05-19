import { createFileRoute } from "@tanstack/react-router";
import { Route as ListenRoute } from "./listen";
export const Route = createFileRoute("/experience/media")({ component: ListenRoute.options.component!, head: ListenRoute.options.head });
