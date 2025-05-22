/*
  Warnings:

  - You are about to drop the `reservations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_rentalId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_userId_fkey";

-- DropTable
DROP TABLE "reservations";

-- CreateTable
CREATE TABLE "rental_bookings" (
    "id" SERIAL NOT NULL,
    "rentalId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "rentals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
