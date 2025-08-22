-- CreateIndex
CREATE INDEX "Appointment_status_createdAt_idx" ON "public"."Appointment"("status", "createdAt");
