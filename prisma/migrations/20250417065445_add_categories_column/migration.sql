/*
  Warnings:

  - You are about to drop the column `category` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `catagories` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reply` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `about` to the `PendingUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bio` to the `PendingUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categories` to the `PendingUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `PendingUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `about` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categories` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `about` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bio` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Reply` DROP FOREIGN KEY `Reply_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Reply` DROP FOREIGN KEY `Reply_userId_fkey`;

-- AlterTable
ALTER TABLE `PendingUser` ADD COLUMN `about` VARCHAR(191) NOT NULL,
    ADD COLUMN `bio` VARCHAR(191) NOT NULL,
    ADD COLUMN `categories` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `category`,
    ADD COLUMN `about` VARCHAR(191) NOT NULL,
    ADD COLUMN `categories` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `catagories`,
    ADD COLUMN `about` VARCHAR(191) NOT NULL,
    ADD COLUMN `bio` VARCHAR(191) NOT NULL,
    ADD COLUMN `categories` VARCHAR(191) NULL,
    ADD COLUMN `statusBook` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `Reply`;

-- CreateTable
CREATE TABLE `LoveDoctor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `doctorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statusBook` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `LoveDoctor_userId_doctorId_key`(`userId`, `doctorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LoveDoctor` ADD CONSTRAINT `LoveDoctor_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoveDoctor` ADD CONSTRAINT `LoveDoctor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
