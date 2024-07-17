/*
  Warnings:

  - Added the required column `isInside` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isInside" BOOLEAN NOT NULL;
