/*
  Warnings:

  - You are about to drop the column `avatar` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `PendingUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PendingUser` ADD COLUMN `avatar` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `avatar`;

-- AlterTable
ALTER TABLE `User` MODIFY `loveStatus` BOOLEAN NOT NULL DEFAULT false;
