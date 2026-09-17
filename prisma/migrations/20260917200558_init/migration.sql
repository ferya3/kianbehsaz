-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'ANSWERED', 'SPAM', 'ARCHIVED');

-- CreateTable
CREATE TABLE "contact_requests" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "phone" VARCHAR(24),
    "company" VARCHAR(160),
    "subject" VARCHAR(160) NOT NULL,
    "message" TEXT NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "ip_hash" VARCHAR(64),
    "user_agent" VARCHAR(512),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "confirmed_at" TIMESTAMP(3),
    "unsubscribed_at" TIMESTAMP(3),
    "ip_hash" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "action" VARCHAR(80) NOT NULL,
    "entity" VARCHAR(80),
    "entity_id" VARCHAR(80),
    "actor" VARCHAR(180),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contact_requests_status_created_at_idx" ON "contact_requests"("status", "created_at");

-- CreateIndex
CREATE INDEX "contact_requests_created_at_idx" ON "contact_requests"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_created_at_idx" ON "newsletter_subscribers"("created_at");

-- CreateIndex
CREATE INDEX "audit_log_action_created_at_idx" ON "audit_log"("action", "created_at");
