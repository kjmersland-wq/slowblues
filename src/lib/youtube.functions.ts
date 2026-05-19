import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  searchVideos,
  fetchPlaylistVideos,
  fetchChannelUploads,
  fetchVideoDetails,
  type YTVideo,
} from "./youtube.server";

export type { YTVideo };

export const searchYouTube = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ query: z.string().min(1).max(120), max: z.number().int().min(1).max(50).optional() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const videos = await searchVideos(data.query, data.max ?? 12);
      return { videos, error: null as string | null };
    } catch (e) {
      console.error("searchYouTube failed:", e);
      return { videos: [] as YTVideo[], error: e instanceof Error ? e.message : "YouTube search failed" };
    }
  });

export const getYouTubePlaylist = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ playlistId: z.string().min(5).max(64), max: z.number().int().min(1).max(50).optional() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const videos = await fetchPlaylistVideos(data.playlistId, data.max ?? 20);
      return { videos, error: null as string | null };
    } catch (e) {
      console.error("getYouTubePlaylist failed:", e);
      return { videos: [] as YTVideo[], error: e instanceof Error ? e.message : "YouTube playlist failed" };
    }
  });

export const getYouTubeChannel = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ channelId: z.string().min(5).max(64), max: z.number().int().min(1).max(50).optional() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const videos = await fetchChannelUploads(data.channelId, data.max ?? 12);
      return { videos, error: null as string | null };
    } catch (e) {
      console.error("getYouTubeChannel failed:", e);
      return { videos: [] as YTVideo[], error: e instanceof Error ? e.message : "YouTube channel failed" };
    }
  });

export const getYouTubeVideos = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ ids: z.array(z.string().min(5).max(20)).min(1).max(50) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const videos = await fetchVideoDetails(data.ids);
      return { videos, error: null as string | null };
    } catch (e) {
      console.error("getYouTubeVideos failed:", e);
      return { videos: [] as YTVideo[], error: e instanceof Error ? e.message : "YouTube videos failed" };
    }
  });
