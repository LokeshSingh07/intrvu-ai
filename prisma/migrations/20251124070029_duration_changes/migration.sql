/*
  Warnings:

  - The values [90,120] on the enum `Duration` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Duration_new" AS ENUM ('10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60');
ALTER TABLE "InterviewSession" ALTER COLUMN "duration" TYPE "Duration_new" USING ("duration"::text::"Duration_new");
ALTER TYPE "Duration" RENAME TO "Duration_old";
ALTER TYPE "Duration_new" RENAME TO "Duration";
DROP TYPE "public"."Duration_old";
COMMIT;
