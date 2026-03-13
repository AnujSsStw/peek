CREATE TABLE "integration_source" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"kind" text NOT NULL,
	"external_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"last_synced_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "integration_source" ADD CONSTRAINT "integration_source_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "integration_source_user_provider_kind_external_id_idx" ON "integration_source" USING btree ("user_id","provider","kind","external_id");
--> statement-breakpoint
CREATE INDEX "integration_source_user_provider_kind_idx" ON "integration_source" USING btree ("user_id","provider","kind");
