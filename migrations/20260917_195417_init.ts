import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."_locales" AS ENUM('fa', 'en', 'ar');
  CREATE TYPE "cms"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum_catalogs_language" AS ENUM('fa', 'en', 'ar');
  CREATE TYPE "cms"."enum_catalogs_category" AS ENUM('product', 'datasheet', 'certificate', 'profile');
  CREATE TYPE "cms"."enum_catalogs_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum_media_gallery_category" AS ENUM('factory', 'products', 'projects', 'team');
  CREATE TYPE "cms"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "cms"."enum_site_settings_social_platform" AS ENUM('linkedin', 'instagram', 'telegram', 'youtube', 'x', 'aparat');
  CREATE TYPE "cms"."enum_careers_positions_employment_type" AS ENUM('full-time', 'part-time', 'contract', 'internship');
  CREATE TABLE "cms"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"status" "cms"."enum_pages_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar NOT NULL,
  	"seo_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."pages_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"content" jsonb NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."products_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"unit" varchar
  );
  
  CREATE TABLE "cms"."products_specifications_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."products_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."products_applications_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_image_id" integer,
  	"category_id" integer NOT NULL,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"status" "cms"."enum_products_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar NOT NULL,
  	"seo_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."products_locales" (
  	"title" varchar NOT NULL,
  	"short_description" varchar,
  	"description" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"catalogs_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "cms"."product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"slug" varchar NOT NULL,
  	"seo_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."product_categories_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."projects_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."projects_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."projects_technical_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."projects_technical_info_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_image_id" integer,
  	"year" numeric,
  	"category_id" integer NOT NULL,
  	"featured" boolean DEFAULT false,
  	"status" "cms"."enum_projects_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar NOT NULL,
  	"seo_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."projects_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"description" jsonb,
  	"client" varchar,
  	"location" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "cms"."project_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"slug" varchar NOT NULL,
  	"seo_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."project_categories_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."articles_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."articles_tags_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_image_id" integer,
  	"reading_minutes" numeric,
  	"author_id" integer,
  	"category_id" integer NOT NULL,
  	"featured" boolean DEFAULT false,
  	"status" "cms"."enum_articles_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar NOT NULL,
  	"seo_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."articles_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" jsonb NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."article_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"slug" varchar NOT NULL,
  	"seo_image_id" integer,
  	"seo_canonical" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."article_categories_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."catalogs_language" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cms"."enum_catalogs_language",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms"."catalogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "cms"."enum_catalogs_category" DEFAULT 'product',
  	"cover_id" integer,
  	"status" "cms"."enum_catalogs_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "cms"."catalogs_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"show_in_gallery" boolean DEFAULT false,
  	"gallery_category" "cms"."enum_media_gallery_category" DEFAULT 'factory',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "cms"."media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "cms"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "cms"."enum_users_role" DEFAULT 'editor' NOT NULL,
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "cms"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"product_categories_id" integer,
  	"projects_id" integer,
  	"project_categories_id" integer,
  	"articles_id" integer,
  	"article_categories_id" integer,
  	"catalogs_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_phones_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"address" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_emails_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "cms"."enum_site_settings_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"default_og_image_id" integer,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"map_embed_url" varchar,
  	"notification_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."site_settings_locales" (
  	"site_name" varchar NOT NULL,
  	"tagline" varchar,
  	"default_seo_description" varchar,
  	"address" varchar,
  	"opening_hours" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_desktop_media_id" integer,
  	"hero_mobile_image_id" integer,
  	"hero_overlay_opacity" numeric DEFAULT 55,
  	"hero_primary_cta_href" varchar,
  	"hero_secondary_cta_href" varchar,
  	"sections_show_intro" boolean DEFAULT true,
  	"sections_show_stats" boolean DEFAULT true,
  	"sections_show_products" boolean DEFAULT true,
  	"sections_show_projects" boolean DEFAULT true,
  	"sections_show_production" boolean DEFAULT true,
  	"sections_show_quality" boolean DEFAULT true,
  	"sections_show_sustainability" boolean DEFAULT true,
  	"sections_show_articles" boolean DEFAULT true,
  	"intro_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."home_page_locales" (
  	"hero_title" varchar,
  	"hero_subtitle" varchar,
  	"hero_primary_cta_label" varchar,
  	"hero_secondary_cta_label" varchar,
  	"intro_title" varchar,
  	"intro_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."careers_positions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"employment_type" "cms"."enum_careers_positions_employment_type" DEFAULT 'full-time',
  	"open" boolean DEFAULT true
  );
  
  CREATE TABLE "cms"."careers_positions_locales" (
  	"title" varchar NOT NULL,
  	"department" varchar,
  	"location" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."careers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"apply_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."careers_locales" (
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "cms"."pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_specifications" ADD CONSTRAINT "products_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_specifications_locales" ADD CONSTRAINT "products_specifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."products_specifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_applications" ADD CONSTRAINT "products_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_applications_locales" ADD CONSTRAINT "products_applications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."products_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products" ADD CONSTRAINT "products_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "cms"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."products" ADD CONSTRAINT "products_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_rels" ADD CONSTRAINT "products_rels_catalogs_fk" FOREIGN KEY ("catalogs_id") REFERENCES "cms"."catalogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."product_categories" ADD CONSTRAINT "product_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."product_categories" ADD CONSTRAINT "product_categories_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."product_categories_locales" ADD CONSTRAINT "product_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."projects_videos" ADD CONSTRAINT "projects_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."projects_videos_locales" ADD CONSTRAINT "projects_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."projects_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."projects_technical_info" ADD CONSTRAINT "projects_technical_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."projects_technical_info_locales" ADD CONSTRAINT "projects_technical_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."projects_technical_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."projects" ADD CONSTRAINT "projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."projects" ADD CONSTRAINT "projects_category_id_project_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "cms"."project_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."projects" ADD CONSTRAINT "projects_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."projects_rels" ADD CONSTRAINT "projects_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."project_categories" ADD CONSTRAINT "project_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."project_categories" ADD CONSTRAINT "project_categories_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."project_categories_locales" ADD CONSTRAINT "project_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."articles_tags" ADD CONSTRAINT "articles_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."articles_tags_locales" ADD CONSTRAINT "articles_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."articles_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."articles" ADD CONSTRAINT "articles_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "cms"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."articles" ADD CONSTRAINT "articles_category_id_article_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "cms"."article_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."articles" ADD CONSTRAINT "articles_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."article_categories" ADD CONSTRAINT "article_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."article_categories" ADD CONSTRAINT "article_categories_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."article_categories_locales" ADD CONSTRAINT "article_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."article_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."catalogs_language" ADD CONSTRAINT "catalogs_language_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."catalogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."catalogs" ADD CONSTRAINT "catalogs_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."catalogs_locales" ADD CONSTRAINT "catalogs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."catalogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "cms"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "cms"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_categories_fk" FOREIGN KEY ("project_categories_id") REFERENCES "cms"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "cms"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_article_categories_fk" FOREIGN KEY ("article_categories_id") REFERENCES "cms"."article_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_catalogs_fk" FOREIGN KEY ("catalogs_id") REFERENCES "cms"."catalogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_phones" ADD CONSTRAINT "site_settings_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_phones_locales" ADD CONSTRAINT "site_settings_phones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings_phones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_emails" ADD CONSTRAINT "site_settings_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_emails_locales" ADD CONSTRAINT "site_settings_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_stats" ADD CONSTRAINT "site_settings_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_stats_locales" ADD CONSTRAINT "site_settings_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."site_settings" ADD CONSTRAINT "site_settings_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."home_page" ADD CONSTRAINT "home_page_hero_desktop_media_id_media_id_fk" FOREIGN KEY ("hero_desktop_media_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."home_page" ADD CONSTRAINT "home_page_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("hero_mobile_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."home_page" ADD CONSTRAINT "home_page_intro_image_id_media_id_fk" FOREIGN KEY ("intro_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."careers_positions" ADD CONSTRAINT "careers_positions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."careers_positions_locales" ADD CONSTRAINT "careers_positions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."careers_positions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."careers_locales" ADD CONSTRAINT "careers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."careers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_image_idx" ON "cms"."pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_status_idx" ON "cms"."pages" USING btree ("status");
  CREATE INDEX "pages_published_at_idx" ON "cms"."pages" USING btree ("published_at");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "cms"."pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_image_idx" ON "cms"."pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "cms"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "cms"."pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "cms"."pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_gallery_order_idx" ON "cms"."products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "cms"."products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "cms"."products_gallery" USING btree ("image_id");
  CREATE INDEX "products_specifications_order_idx" ON "cms"."products_specifications" USING btree ("_order");
  CREATE INDEX "products_specifications_parent_id_idx" ON "cms"."products_specifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_specifications_locales_locale_parent_id_unique" ON "cms"."products_specifications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_applications_order_idx" ON "cms"."products_applications" USING btree ("_order");
  CREATE INDEX "products_applications_parent_id_idx" ON "cms"."products_applications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_applications_locales_locale_parent_id_unique" ON "cms"."products_applications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_cover_image_idx" ON "cms"."products" USING btree ("cover_image_id");
  CREATE INDEX "products_category_idx" ON "cms"."products" USING btree ("category_id");
  CREATE INDEX "products_featured_idx" ON "cms"."products" USING btree ("featured");
  CREATE INDEX "products_status_idx" ON "cms"."products" USING btree ("status");
  CREATE INDEX "products_published_at_idx" ON "cms"."products" USING btree ("published_at");
  CREATE UNIQUE INDEX "products_slug_idx" ON "cms"."products" USING btree ("slug");
  CREATE INDEX "products_seo_seo_image_idx" ON "cms"."products" USING btree ("seo_image_id");
  CREATE INDEX "products_updated_at_idx" ON "cms"."products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "cms"."products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "cms"."products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "cms"."products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "cms"."products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "cms"."products_rels" USING btree ("path");
  CREATE INDEX "products_rels_catalogs_id_idx" ON "cms"."products_rels" USING btree ("catalogs_id");
  CREATE INDEX "products_rels_products_id_idx" ON "cms"."products_rels" USING btree ("products_id");
  CREATE INDEX "product_categories_image_idx" ON "cms"."product_categories" USING btree ("image_id");
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "cms"."product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_seo_seo_image_idx" ON "cms"."product_categories" USING btree ("seo_image_id");
  CREATE INDEX "product_categories_updated_at_idx" ON "cms"."product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "cms"."product_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_categories_locales_locale_parent_id_unique" ON "cms"."product_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_gallery_order_idx" ON "cms"."projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "cms"."projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "cms"."projects_gallery" USING btree ("image_id");
  CREATE INDEX "projects_videos_order_idx" ON "cms"."projects_videos" USING btree ("_order");
  CREATE INDEX "projects_videos_parent_id_idx" ON "cms"."projects_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_videos_locales_locale_parent_id_unique" ON "cms"."projects_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_technical_info_order_idx" ON "cms"."projects_technical_info" USING btree ("_order");
  CREATE INDEX "projects_technical_info_parent_id_idx" ON "cms"."projects_technical_info" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_technical_info_locales_locale_parent_id_unique" ON "cms"."projects_technical_info_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_cover_image_idx" ON "cms"."projects" USING btree ("cover_image_id");
  CREATE INDEX "projects_category_idx" ON "cms"."projects" USING btree ("category_id");
  CREATE INDEX "projects_featured_idx" ON "cms"."projects" USING btree ("featured");
  CREATE INDEX "projects_status_idx" ON "cms"."projects" USING btree ("status");
  CREATE INDEX "projects_published_at_idx" ON "cms"."projects" USING btree ("published_at");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "cms"."projects" USING btree ("slug");
  CREATE INDEX "projects_seo_seo_image_idx" ON "cms"."projects" USING btree ("seo_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "cms"."projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "cms"."projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "cms"."projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "cms"."projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "cms"."projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "cms"."projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_products_id_idx" ON "cms"."projects_rels" USING btree ("products_id");
  CREATE INDEX "project_categories_image_idx" ON "cms"."project_categories" USING btree ("image_id");
  CREATE UNIQUE INDEX "project_categories_slug_idx" ON "cms"."project_categories" USING btree ("slug");
  CREATE INDEX "project_categories_seo_seo_image_idx" ON "cms"."project_categories" USING btree ("seo_image_id");
  CREATE INDEX "project_categories_updated_at_idx" ON "cms"."project_categories" USING btree ("updated_at");
  CREATE INDEX "project_categories_created_at_idx" ON "cms"."project_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "project_categories_locales_locale_parent_id_unique" ON "cms"."project_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_tags_order_idx" ON "cms"."articles_tags" USING btree ("_order");
  CREATE INDEX "articles_tags_parent_id_idx" ON "cms"."articles_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_tags_locales_locale_parent_id_unique" ON "cms"."articles_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_cover_image_idx" ON "cms"."articles" USING btree ("cover_image_id");
  CREATE INDEX "articles_author_idx" ON "cms"."articles" USING btree ("author_id");
  CREATE INDEX "articles_category_idx" ON "cms"."articles" USING btree ("category_id");
  CREATE INDEX "articles_featured_idx" ON "cms"."articles" USING btree ("featured");
  CREATE INDEX "articles_status_idx" ON "cms"."articles" USING btree ("status");
  CREATE INDEX "articles_published_at_idx" ON "cms"."articles" USING btree ("published_at");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "cms"."articles" USING btree ("slug");
  CREATE INDEX "articles_seo_seo_image_idx" ON "cms"."articles" USING btree ("seo_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "cms"."articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "cms"."articles" USING btree ("created_at");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "cms"."articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "article_categories_image_idx" ON "cms"."article_categories" USING btree ("image_id");
  CREATE UNIQUE INDEX "article_categories_slug_idx" ON "cms"."article_categories" USING btree ("slug");
  CREATE INDEX "article_categories_seo_seo_image_idx" ON "cms"."article_categories" USING btree ("seo_image_id");
  CREATE INDEX "article_categories_updated_at_idx" ON "cms"."article_categories" USING btree ("updated_at");
  CREATE INDEX "article_categories_created_at_idx" ON "cms"."article_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "article_categories_locales_locale_parent_id_unique" ON "cms"."article_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "catalogs_language_order_idx" ON "cms"."catalogs_language" USING btree ("order");
  CREATE INDEX "catalogs_language_parent_idx" ON "cms"."catalogs_language" USING btree ("parent_id");
  CREATE INDEX "catalogs_cover_idx" ON "cms"."catalogs" USING btree ("cover_id");
  CREATE INDEX "catalogs_status_idx" ON "cms"."catalogs" USING btree ("status");
  CREATE INDEX "catalogs_updated_at_idx" ON "cms"."catalogs" USING btree ("updated_at");
  CREATE INDEX "catalogs_created_at_idx" ON "cms"."catalogs" USING btree ("created_at");
  CREATE UNIQUE INDEX "catalogs_filename_idx" ON "cms"."catalogs" USING btree ("filename");
  CREATE UNIQUE INDEX "catalogs_locales_locale_parent_id_unique" ON "cms"."catalogs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_show_in_gallery_idx" ON "cms"."media" USING btree ("show_in_gallery");
  CREATE INDEX "media_updated_at_idx" ON "cms"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "cms"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "cms"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "cms"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "cms"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "cms"."media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "cms"."media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "cms"."media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "cms"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "cms"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "cms"."users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "cms"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "cms"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "cms"."users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "cms"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "cms"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "cms"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "cms"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "cms"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "cms"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "cms"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_project_categories_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("project_categories_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_article_categories_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("article_categories_id");
  CREATE INDEX "payload_locked_documents_rels_catalogs_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("catalogs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "cms"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "cms"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "cms"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "cms"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "cms"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "cms"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "cms"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "cms"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "cms"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_phones_order_idx" ON "cms"."site_settings_phones" USING btree ("_order");
  CREATE INDEX "site_settings_phones_parent_id_idx" ON "cms"."site_settings_phones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_phones_locales_locale_parent_id_unique" ON "cms"."site_settings_phones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_emails_order_idx" ON "cms"."site_settings_emails" USING btree ("_order");
  CREATE INDEX "site_settings_emails_parent_id_idx" ON "cms"."site_settings_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_emails_locales_locale_parent_id_unique" ON "cms"."site_settings_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_social_order_idx" ON "cms"."site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "cms"."site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_stats_order_idx" ON "cms"."site_settings_stats" USING btree ("_order");
  CREATE INDEX "site_settings_stats_parent_id_idx" ON "cms"."site_settings_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_stats_locales_locale_parent_id_unique" ON "cms"."site_settings_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "cms"."site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "site_settings_logo_idx" ON "cms"."site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_dark_idx" ON "cms"."site_settings" USING btree ("logo_dark_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "cms"."site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_hero_hero_desktop_media_idx" ON "cms"."home_page" USING btree ("hero_desktop_media_id");
  CREATE INDEX "home_page_hero_hero_mobile_image_idx" ON "cms"."home_page" USING btree ("hero_mobile_image_id");
  CREATE INDEX "home_page_intro_intro_image_idx" ON "cms"."home_page" USING btree ("intro_image_id");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "cms"."home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "careers_positions_order_idx" ON "cms"."careers_positions" USING btree ("_order");
  CREATE INDEX "careers_positions_parent_id_idx" ON "cms"."careers_positions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "careers_positions_locales_locale_parent_id_unique" ON "cms"."careers_positions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "careers_locales_locale_parent_id_unique" ON "cms"."careers_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cms"."pages" CASCADE;
  DROP TABLE "cms"."pages_locales" CASCADE;
  DROP TABLE "cms"."products_gallery" CASCADE;
  DROP TABLE "cms"."products_specifications" CASCADE;
  DROP TABLE "cms"."products_specifications_locales" CASCADE;
  DROP TABLE "cms"."products_applications" CASCADE;
  DROP TABLE "cms"."products_applications_locales" CASCADE;
  DROP TABLE "cms"."products" CASCADE;
  DROP TABLE "cms"."products_locales" CASCADE;
  DROP TABLE "cms"."products_rels" CASCADE;
  DROP TABLE "cms"."product_categories" CASCADE;
  DROP TABLE "cms"."product_categories_locales" CASCADE;
  DROP TABLE "cms"."projects_gallery" CASCADE;
  DROP TABLE "cms"."projects_videos" CASCADE;
  DROP TABLE "cms"."projects_videos_locales" CASCADE;
  DROP TABLE "cms"."projects_technical_info" CASCADE;
  DROP TABLE "cms"."projects_technical_info_locales" CASCADE;
  DROP TABLE "cms"."projects" CASCADE;
  DROP TABLE "cms"."projects_locales" CASCADE;
  DROP TABLE "cms"."projects_rels" CASCADE;
  DROP TABLE "cms"."project_categories" CASCADE;
  DROP TABLE "cms"."project_categories_locales" CASCADE;
  DROP TABLE "cms"."articles_tags" CASCADE;
  DROP TABLE "cms"."articles_tags_locales" CASCADE;
  DROP TABLE "cms"."articles" CASCADE;
  DROP TABLE "cms"."articles_locales" CASCADE;
  DROP TABLE "cms"."article_categories" CASCADE;
  DROP TABLE "cms"."article_categories_locales" CASCADE;
  DROP TABLE "cms"."catalogs_language" CASCADE;
  DROP TABLE "cms"."catalogs" CASCADE;
  DROP TABLE "cms"."catalogs_locales" CASCADE;
  DROP TABLE "cms"."media" CASCADE;
  DROP TABLE "cms"."media_locales" CASCADE;
  DROP TABLE "cms"."users_sessions" CASCADE;
  DROP TABLE "cms"."users" CASCADE;
  DROP TABLE "cms"."payload_kv" CASCADE;
  DROP TABLE "cms"."payload_locked_documents" CASCADE;
  DROP TABLE "cms"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "cms"."payload_preferences" CASCADE;
  DROP TABLE "cms"."payload_preferences_rels" CASCADE;
  DROP TABLE "cms"."payload_migrations" CASCADE;
  DROP TABLE "cms"."site_settings_phones" CASCADE;
  DROP TABLE "cms"."site_settings_phones_locales" CASCADE;
  DROP TABLE "cms"."site_settings_emails" CASCADE;
  DROP TABLE "cms"."site_settings_emails_locales" CASCADE;
  DROP TABLE "cms"."site_settings_social" CASCADE;
  DROP TABLE "cms"."site_settings_stats" CASCADE;
  DROP TABLE "cms"."site_settings_stats_locales" CASCADE;
  DROP TABLE "cms"."site_settings" CASCADE;
  DROP TABLE "cms"."site_settings_locales" CASCADE;
  DROP TABLE "cms"."home_page" CASCADE;
  DROP TABLE "cms"."home_page_locales" CASCADE;
  DROP TABLE "cms"."careers_positions" CASCADE;
  DROP TABLE "cms"."careers_positions_locales" CASCADE;
  DROP TABLE "cms"."careers" CASCADE;
  DROP TABLE "cms"."careers_locales" CASCADE;
  DROP TYPE "cms"."_locales";
  DROP TYPE "cms"."enum_pages_status";
  DROP TYPE "cms"."enum_products_status";
  DROP TYPE "cms"."enum_projects_status";
  DROP TYPE "cms"."enum_articles_status";
  DROP TYPE "cms"."enum_catalogs_language";
  DROP TYPE "cms"."enum_catalogs_category";
  DROP TYPE "cms"."enum_catalogs_status";
  DROP TYPE "cms"."enum_media_gallery_category";
  DROP TYPE "cms"."enum_users_role";
  DROP TYPE "cms"."enum_site_settings_social_platform";
  DROP TYPE "cms"."enum_careers_positions_employment_type";`)
}
