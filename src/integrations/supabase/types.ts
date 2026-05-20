export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artist_images: {
        Row: {
          artist_slug: string
          created_at: string
          credit: string | null
          credit_url: string | null
          id: string
          image_url: string
          is_primary: boolean
          notes: string | null
          source: string
          updated_at: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          artist_slug: string
          created_at?: string
          credit?: string | null
          credit_url?: string | null
          id?: string
          image_url: string
          is_primary?: boolean
          notes?: string | null
          source: string
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          artist_slug?: string
          created_at?: string
          credit?: string | null
          credit_url?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean
          notes?: string | null
          source?: string
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      artist_qc_flags: {
        Row: {
          artist_slug: string
          created_at: string
          flag_type: string
          id: string
          message: string | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          updated_at: string
        }
        Insert: {
          artist_slug: string
          created_at?: string
          flag_type: string
          id?: string
          message?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          updated_at?: string
        }
        Update: {
          artist_slug?: string
          created_at?: string
          flag_type?: string
          id?: string
          message?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          updated_at?: string
        }
        Relationships: []
      }
      artists: {
        Row: {
          active_years: string | null
          alt_name: string | null
          anecdotes: Json
          anecdotes_en: Json
          anecdotes_no: Json
          article_references: Json
          awards: Json
          base_path: string | null
          bio: string[]
          biography_de: string | null
          biography_en: string | null
          biography_no: string | null
          biography_sv: string | null
          birth_name: string | null
          birth_place: string | null
          born: string | null
          categories: string[]
          collaborators: Json
          collaborators_en: Json
          country: string | null
          created_at: string
          died: string | null
          discography: Json
          era: string | null
          era_label_en: string | null
          era_label_no: string | null
          era_label_sv: string | null
          external_links: Json
          facebook_url: string | null
          family: Json
          family_en: Json
          family_no: Json
          formative: Json
          formative_de: Json
          formative_en: Json
          formative_no: Json
          gallery_images: string[]
          id: string
          image_credit: string | null
          img: string | null
          influence_en: string | null
          influence_no: string | null
          influence_note: string | null
          influence_sv: string | null
          influences: string[]
          instruments: Json
          instruments_en: Json
          instruments_simple: string[]
          key_recordings: Json
          labels: string[]
          legacy: string | null
          link_check: Json
          name: string
          og_image: string | null
          origin: string | null
          press_quotes: Json
          region: string | null
          related_slugs: string[]
          route_path: string | null
          search_terms: string[]
          seo_description_en: string | null
          seo_description_no: string | null
          seo_description_sv: string | null
          seo_title_en: string | null
          seo_title_no: string | null
          seo_title_sv: string | null
          short: string | null
          short_en: string | null
          short_no: string | null
          short_sv: string | null
          signature_songs: string[]
          slug: string
          social_links: Json
          sort_order: number
          source_file: string | null
          source_region: string | null
          styles: string[]
          tag: string
          updated_at: string
          video_search_query: string | null
          videos: Json
          website_url: string | null
          youtube_video_ids: string[]
        }
        Insert: {
          active_years?: string | null
          alt_name?: string | null
          anecdotes?: Json
          anecdotes_en?: Json
          anecdotes_no?: Json
          article_references?: Json
          awards?: Json
          base_path?: string | null
          bio?: string[]
          biography_de?: string | null
          biography_en?: string | null
          biography_no?: string | null
          biography_sv?: string | null
          birth_name?: string | null
          birth_place?: string | null
          born?: string | null
          categories?: string[]
          collaborators?: Json
          collaborators_en?: Json
          country?: string | null
          created_at?: string
          died?: string | null
          discography?: Json
          era?: string | null
          era_label_en?: string | null
          era_label_no?: string | null
          era_label_sv?: string | null
          external_links?: Json
          facebook_url?: string | null
          family?: Json
          family_en?: Json
          family_no?: Json
          formative?: Json
          formative_de?: Json
          formative_en?: Json
          formative_no?: Json
          gallery_images?: string[]
          id?: string
          image_credit?: string | null
          img?: string | null
          influence_en?: string | null
          influence_no?: string | null
          influence_note?: string | null
          influence_sv?: string | null
          influences?: string[]
          instruments?: Json
          instruments_en?: Json
          instruments_simple?: string[]
          key_recordings?: Json
          labels?: string[]
          legacy?: string | null
          link_check?: Json
          name: string
          og_image?: string | null
          origin?: string | null
          press_quotes?: Json
          region?: string | null
          related_slugs?: string[]
          route_path?: string | null
          search_terms?: string[]
          seo_description_en?: string | null
          seo_description_no?: string | null
          seo_description_sv?: string | null
          seo_title_en?: string | null
          seo_title_no?: string | null
          seo_title_sv?: string | null
          short?: string | null
          short_en?: string | null
          short_no?: string | null
          short_sv?: string | null
          signature_songs?: string[]
          slug: string
          social_links?: Json
          sort_order?: number
          source_file?: string | null
          source_region?: string | null
          styles?: string[]
          tag?: string
          updated_at?: string
          video_search_query?: string | null
          videos?: Json
          website_url?: string | null
          youtube_video_ids?: string[]
        }
        Update: {
          active_years?: string | null
          alt_name?: string | null
          anecdotes?: Json
          anecdotes_en?: Json
          anecdotes_no?: Json
          article_references?: Json
          awards?: Json
          base_path?: string | null
          bio?: string[]
          biography_de?: string | null
          biography_en?: string | null
          biography_no?: string | null
          biography_sv?: string | null
          birth_name?: string | null
          birth_place?: string | null
          born?: string | null
          categories?: string[]
          collaborators?: Json
          collaborators_en?: Json
          country?: string | null
          created_at?: string
          died?: string | null
          discography?: Json
          era?: string | null
          era_label_en?: string | null
          era_label_no?: string | null
          era_label_sv?: string | null
          external_links?: Json
          facebook_url?: string | null
          family?: Json
          family_en?: Json
          family_no?: Json
          formative?: Json
          formative_de?: Json
          formative_en?: Json
          formative_no?: Json
          gallery_images?: string[]
          id?: string
          image_credit?: string | null
          img?: string | null
          influence_en?: string | null
          influence_no?: string | null
          influence_note?: string | null
          influence_sv?: string | null
          influences?: string[]
          instruments?: Json
          instruments_en?: Json
          instruments_simple?: string[]
          key_recordings?: Json
          labels?: string[]
          legacy?: string | null
          link_check?: Json
          name?: string
          og_image?: string | null
          origin?: string | null
          press_quotes?: Json
          region?: string | null
          related_slugs?: string[]
          route_path?: string | null
          search_terms?: string[]
          seo_description_en?: string | null
          seo_description_no?: string | null
          seo_description_sv?: string | null
          seo_title_en?: string | null
          seo_title_no?: string | null
          seo_title_sv?: string | null
          short?: string | null
          short_en?: string | null
          short_no?: string | null
          short_sv?: string | null
          signature_songs?: string[]
          slug?: string
          social_links?: Json
          sort_order?: number
          source_file?: string | null
          source_region?: string | null
          styles?: string[]
          tag?: string
          updated_at?: string
          video_search_query?: string | null
          videos?: Json
          website_url?: string | null
          youtube_video_ids?: string[]
        }
        Relationships: []
      }
      blues_reviews: {
        Row: {
          album_title: string
          apple_music_url: string | null
          artist_name: string
          artist_slug: string | null
          bandcamp_url: string | null
          blues_style: string | null
          body_de: string | null
          body_en: string | null
          body_no: string | null
          body_sv: string | null
          cover_credit: string | null
          cover_image: string | null
          created_at: string
          id: string
          label: string | null
          published_at: string | null
          release_year: number | null
          reviewer: string | null
          score_atmosphere: number | null
          score_instrumentation: number | null
          score_production: number | null
          score_songwriting: number | null
          score_vocals: number | null
          seo_description_de: string | null
          seo_description_en: string | null
          seo_description_no: string | null
          seo_description_sv: string | null
          seo_title_de: string | null
          seo_title_en: string | null
          seo_title_no: string | null
          seo_title_sv: string | null
          slug: string
          spotify_album_id: string | null
          status: string
          title_de: string | null
          title_en: string | null
          title_no: string | null
          title_sv: string | null
          total_score: number | null
          updated_at: string
          verdict_de: string | null
          verdict_en: string | null
          verdict_no: string | null
          verdict_sv: string | null
          youtube_playlist_id: string | null
        }
        Insert: {
          album_title: string
          apple_music_url?: string | null
          artist_name: string
          artist_slug?: string | null
          bandcamp_url?: string | null
          blues_style?: string | null
          body_de?: string | null
          body_en?: string | null
          body_no?: string | null
          body_sv?: string | null
          cover_credit?: string | null
          cover_image?: string | null
          created_at?: string
          id?: string
          label?: string | null
          published_at?: string | null
          release_year?: number | null
          reviewer?: string | null
          score_atmosphere?: number | null
          score_instrumentation?: number | null
          score_production?: number | null
          score_songwriting?: number | null
          score_vocals?: number | null
          seo_description_de?: string | null
          seo_description_en?: string | null
          seo_description_no?: string | null
          seo_description_sv?: string | null
          seo_title_de?: string | null
          seo_title_en?: string | null
          seo_title_no?: string | null
          seo_title_sv?: string | null
          slug: string
          spotify_album_id?: string | null
          status?: string
          title_de?: string | null
          title_en?: string | null
          title_no?: string | null
          title_sv?: string | null
          total_score?: number | null
          updated_at?: string
          verdict_de?: string | null
          verdict_en?: string | null
          verdict_no?: string | null
          verdict_sv?: string | null
          youtube_playlist_id?: string | null
        }
        Update: {
          album_title?: string
          apple_music_url?: string | null
          artist_name?: string
          artist_slug?: string | null
          bandcamp_url?: string | null
          blues_style?: string | null
          body_de?: string | null
          body_en?: string | null
          body_no?: string | null
          body_sv?: string | null
          cover_credit?: string | null
          cover_image?: string | null
          created_at?: string
          id?: string
          label?: string | null
          published_at?: string | null
          release_year?: number | null
          reviewer?: string | null
          score_atmosphere?: number | null
          score_instrumentation?: number | null
          score_production?: number | null
          score_songwriting?: number | null
          score_vocals?: number | null
          seo_description_de?: string | null
          seo_description_en?: string | null
          seo_description_no?: string | null
          seo_description_sv?: string | null
          seo_title_de?: string | null
          seo_title_en?: string | null
          seo_title_no?: string | null
          seo_title_sv?: string | null
          slug?: string
          spotify_album_id?: string | null
          status?: string
          title_de?: string | null
          title_en?: string | null
          title_no?: string | null
          title_sv?: string | null
          total_score?: number | null
          updated_at?: string
          verdict_de?: string | null
          verdict_en?: string | null
          verdict_no?: string | null
          verdict_sv?: string | null
          youtube_playlist_id?: string | null
        }
        Relationships: []
      }
      concerts: {
        Row: {
          artist_name: string | null
          artist_slug: string | null
          city: string | null
          country: string | null
          cover_image: string | null
          created_at: string
          description_de: string | null
          description_en: string | null
          description_no: string | null
          description_sv: string | null
          end_date: string | null
          event_date: string | null
          event_type: string
          id: string
          is_featured: boolean
          published_at: string | null
          seo_description_en: string | null
          seo_title_en: string | null
          slug: string
          sort_order: number
          status: string
          ticket_url: string | null
          title: string
          updated_at: string
          venue: string | null
          youtube_video_id: string | null
        }
        Insert: {
          artist_name?: string | null
          artist_slug?: string | null
          city?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string
          description_de?: string | null
          description_en?: string | null
          description_no?: string | null
          description_sv?: string | null
          end_date?: string | null
          event_date?: string | null
          event_type?: string
          id?: string
          is_featured?: boolean
          published_at?: string | null
          seo_description_en?: string | null
          seo_title_en?: string | null
          slug: string
          sort_order?: number
          status?: string
          ticket_url?: string | null
          title: string
          updated_at?: string
          venue?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          artist_name?: string | null
          artist_slug?: string | null
          city?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string
          description_de?: string | null
          description_en?: string | null
          description_no?: string | null
          description_sv?: string | null
          end_date?: string | null
          event_date?: string | null
          event_type?: string
          id?: string
          is_featured?: boolean
          published_at?: string | null
          seo_description_en?: string | null
          seo_title_en?: string | null
          slug?: string
          sort_order?: number
          status?: string
          ticket_url?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
          youtube_video_id?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      guestbook_entries: {
        Row: {
          created_at: string
          id: string
          location: string | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          message: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          message?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          added_by: string | null
          artist_slug: string
          category: string
          channel_id: string | null
          channel_title: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          is_official_channel: boolean
          published_at: string | null
          sort_order: number
          status: string
          thumbnail_url: string | null
          title: string | null
          updated_at: string
          video_id: string
          view_count: number | null
        }
        Insert: {
          added_by?: string | null
          artist_slug: string
          category?: string
          channel_id?: string | null
          channel_title?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_official_channel?: boolean
          published_at?: string | null
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          video_id: string
          view_count?: number | null
        }
        Update: {
          added_by?: string | null
          artist_slug?: string
          category?: string
          channel_id?: string | null
          channel_title?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_official_channel?: boolean
          published_at?: string | null
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          video_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
