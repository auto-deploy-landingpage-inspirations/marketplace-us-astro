drop policy "Enable select for authenticated users only" on "public"."post_category";

revoke delete on table "public"."post_category" from "anon";

revoke insert on table "public"."post_category" from "anon";

revoke references on table "public"."post_category" from "anon";

revoke select on table "public"."post_category" from "anon";

revoke trigger on table "public"."post_category" from "anon";

revoke truncate on table "public"."post_category" from "anon";

revoke update on table "public"."post_category" from "anon";

revoke delete on table "public"."post_category" from "authenticated";

revoke insert on table "public"."post_category" from "authenticated";

revoke references on table "public"."post_category" from "authenticated";

revoke select on table "public"."post_category" from "authenticated";

revoke trigger on table "public"."post_category" from "authenticated";

revoke truncate on table "public"."post_category" from "authenticated";

revoke update on table "public"."post_category" from "authenticated";

revoke delete on table "public"."post_category" from "service_role";

revoke insert on table "public"."post_category" from "service_role";

revoke references on table "public"."post_category" from "service_role";

revoke select on table "public"."post_category" from "service_role";

revoke trigger on table "public"."post_category" from "service_role";

revoke truncate on table "public"."post_category" from "service_role";

revoke update on table "public"."post_category" from "service_role";

alter table "public"."seller_post" drop constraint "seller_post_product_category_fkey";

alter table "public"."post_category" drop constraint "post_category_id_key";

alter table "public"."post_category" drop constraint "post_category_language_fkey";

alter table "public"."post_category" drop constraint "post_category_pkey";

drop index if exists "public"."post_category_id_key";

drop index if exists "public"."post_category_pkey";

drop table "public"."post_category";

create table "public"."post_subject" (
    "id" bigint generated by default as identity not null,
    "subject" text not null,
    "language" bigint not null
);


alter table "public"."post_subject" enable row level security;

alter table "public"."seller_post" drop column "product_category" CASCADE;

alter table "public"."seller_post" add column "product_subject" text[] not null;

CREATE UNIQUE INDEX post_subject_id_key ON public.post_subject USING btree (id);

CREATE UNIQUE INDEX post_subject_pkey ON public.post_subject USING btree (id);

alter table "public"."post_subject" add constraint "post_subject_pkey" PRIMARY KEY using index "post_subject_pkey";

alter table "public"."post_subject" add constraint "post_subject_id_key" UNIQUE using index "post_subject_id_key";

alter table "public"."post_subject" add constraint "post_subject_language_fkey" FOREIGN KEY (language) REFERENCES language(id) not valid;

alter table "public"."post_subject" validate constraint "post_subject_language_fkey";

-- alter table "public"."seller_post" add constraint "seller_post_product_subject_fkey" FOREIGN KEY (product_subject) REFERENCES post_subject(id) not valid;

-- alter table "public"."seller_post" validate constraint "seller_post_product_subject_fkey";

create or replace view "public"."sellerposts" as  SELECT seller_post.id,
    seller_post.title,
    seller_post.content,
    seller_post.user_id,
    seller_post.image_urls,
    seller_post.product_subject,
    locationview.major_municipality,
    locationview.minor_municipality,
    locationview.governing_district,
    sellers.seller_name,
    sellers.seller_id,
    profiles.email,
    seller_post.stripe_price_id AS price_id,
    seller_post.stripe_product_id AS product_id
   FROM (((seller_post
     LEFT JOIN profiles ON ((seller_post.user_id = profiles.user_id)))
     LEFT JOIN sellers ON ((seller_post.user_id = sellers.user_id)))
     LEFT JOIN locationview ON ((seller_post.location = locationview.id)));

CREATE OR REPLACE FUNCTION "public"."title_content"("public"."sellerposts") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$
  select $1.title || ' ' || $1.content;
$_$;

grant delete on table "public"."post_subject" to "anon";

grant insert on table "public"."post_subject" to "anon";

grant references on table "public"."post_subject" to "anon";

grant select on table "public"."post_subject" to "anon";

grant trigger on table "public"."post_subject" to "anon";

grant truncate on table "public"."post_subject" to "anon";

grant update on table "public"."post_subject" to "anon";

grant delete on table "public"."post_subject" to "authenticated";

grant insert on table "public"."post_subject" to "authenticated";

grant references on table "public"."post_subject" to "authenticated";

grant select on table "public"."post_subject" to "authenticated";

grant trigger on table "public"."post_subject" to "authenticated";

grant truncate on table "public"."post_subject" to "authenticated";

grant update on table "public"."post_subject" to "authenticated";

grant delete on table "public"."post_subject" to "service_role";

grant insert on table "public"."post_subject" to "service_role";

grant references on table "public"."post_subject" to "service_role";

grant select on table "public"."post_subject" to "service_role";

grant trigger on table "public"."post_subject" to "service_role";

grant truncate on table "public"."post_subject" to "service_role";

grant update on table "public"."post_subject" to "service_role";

create policy "Enable select for authenticated users only"
on "public"."post_subject"
as permissive
for select
to authenticated
using (true);



-- alter table "public"."seller_post"drop constraint"seller_post_product_subject_fkey";

-- drop view if exists"public"."sellerposts" cascade;

-- alter table "public"."seller_post" alter column "product_subject" set data type text[] using "product_subject"::text[];


  
