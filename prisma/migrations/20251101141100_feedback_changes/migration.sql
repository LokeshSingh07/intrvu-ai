/*
  Warnings:

  - You are about to drop the column `feedback` on the `InterviewSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InterviewSession" DROP COLUMN "feedback",
ADD COLUMN     "improvements" TEXT[],
ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "improvements" TEXT[],
ADD COLUMN     "isCorrect" BOOLEAN,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "strengths" TEXT[];
