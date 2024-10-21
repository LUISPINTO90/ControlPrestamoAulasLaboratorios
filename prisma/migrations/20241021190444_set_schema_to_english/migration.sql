/*
  Warnings:

  - You are about to drop the `Espacio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HistorialReserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Student', 'Teacher', 'Administrator');

-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('Laboratory', 'Classroom');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Reserved', 'Cancelled', 'Completed');

-- DropForeignKey
ALTER TABLE "HistorialReserva" DROP CONSTRAINT "HistorialReserva_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_espacioId_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioId_fkey";

-- DropTable
DROP TABLE "Espacio";

-- DropTable
DROP TABLE "HistorialReserva";

-- DropTable
DROP TABLE "Reserva";

-- DropTable
DROP TABLE "Usuario";

-- DropEnum
DROP TYPE "Estado";

-- DropEnum
DROP TYPE "TipoEspacio";

-- DropEnum
DROP TYPE "TipoUsuario";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "userType" "UserType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "spaceType" "SpaceType" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "location" VARCHAR(100) NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "spaceId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingHistory" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "changeDate" DATE NOT NULL,

    CONSTRAINT "BookingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHistory" ADD CONSTRAINT "BookingHistory_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
