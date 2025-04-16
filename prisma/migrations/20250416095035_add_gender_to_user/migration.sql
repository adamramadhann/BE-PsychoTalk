/*
  Warnings:

  - Added the required column `gender` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `catagories` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PendingUser` MODIFY `role` VARCHAR(191) NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `gender` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `catagories` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL;
