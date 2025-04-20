/*
  Warnings:

  - You are about to drop the column `statusBook` on the `LoveDoctor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,doctorId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doctorId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loveStatus` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LoveDoctor` DROP COLUMN `statusBook`,
    ADD COLUMN `loveStatus` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `doctorId` INTEGER NOT NULL,
    ADD COLUMN `loveStatus` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatar` VARCHAR(191) NOT NULL,
    ADD COLUMN `loveStatus` BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Profile_userId_doctorId_key` ON `Profile`(`userId`, `doctorId`);

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
