/*
  Warnings:

  - A unique constraint covering the columns `[weekday]` on the table `AvailabilityRule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date]` on the table `BlackoutDate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."AvailabilityRule_weekday_startTime_endTime_key";

-- AlterTable
ALTER TABLE "public"."AvailabilityRule" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."BlackoutDate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityRule_weekday_key" ON "public"."AvailabilityRule"("weekday");

-- CreateIndex
CREATE UNIQUE INDEX "BlackoutDate_date_key" ON "public"."BlackoutDate"("date");
