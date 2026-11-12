/*
  Warnings:

  - Added the required column `updatedAt` to the `InterviewSession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_interviewSessionId_fkey";

-- AlterTable
ALTER TABLE "InterviewSession" ADD COLUMN     "status" "InterviewStatus" NOT NULL DEFAULT 'IN_PROGRESS',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_interviewSessionId_fkey" FOREIGN KEY ("interviewSessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
