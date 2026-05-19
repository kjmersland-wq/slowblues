import { createFileRoute } from "@tanstack/react-router";
import ListenRoute from "./listen";
export const Route = createFileRoute("/experience/media")(ListenRoute as any);
