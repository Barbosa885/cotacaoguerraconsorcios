-- CreateEnum
CREATE TYPE "public"."ListingStatus" AS ENUM ('ACTIVE', 'SOLD', 'REMOVED');

-- CreateTable
CREATE TABLE "public"."VehicleListing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sellerId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "fipeCode" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "mileage" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "optionals" JSONB NOT NULL,
    "status" "public"."ListingStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "VehicleListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VehicleListing_sellerId_idx" ON "public"."VehicleListing"("sellerId");

-- CreateIndex
CREATE INDEX "VehicleListing_status_idx" ON "public"."VehicleListing"("status");

-- AddForeignKey
ALTER TABLE "public"."VehicleListing" ADD CONSTRAINT "VehicleListing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
