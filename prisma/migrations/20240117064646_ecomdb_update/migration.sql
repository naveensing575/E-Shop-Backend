/*
  Warnings:

  - The primary key for the `cartitem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `cartitem` table. All the data in the column will be lost.
  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `product` table. All the data in the column will be lost.
  - The primary key for the `purchasedproduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `purchasedproduct` table. All the data in the column will be lost.
  - The primary key for the `purchasehistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `purchasehistory` table. All the data in the column will be lost.
  - The primary key for the `shoppingcart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `shoppingcart` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - Added the required column `cartItemId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchasedProductId` to the `PurchasedProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseHistoryId` to the `PurchaseHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shoppingCartId` to the `ShoppingCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_shoppingCartId_fkey`;

-- DropForeignKey
ALTER TABLE `purchasedproduct` DROP FOREIGN KEY `PurchasedProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `purchasedproduct` DROP FOREIGN KEY `PurchasedProduct_purchaseHistoryId_fkey`;

-- DropForeignKey
ALTER TABLE `purchasehistory` DROP FOREIGN KEY `PurchaseHistory_userId_fkey`;

-- DropForeignKey
ALTER TABLE `shoppingcart` DROP FOREIGN KEY `ShoppingCart_userId_fkey`;

-- AlterTable
ALTER TABLE `cartitem` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `cartItemId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`cartItemId`);

-- AlterTable
ALTER TABLE `product` DROP PRIMARY KEY,
    DROP COLUMN `description`,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `productId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `productName` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`productId`);

-- AlterTable
ALTER TABLE `purchasedproduct` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `purchasedProductId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`purchasedProductId`);

-- AlterTable
ALTER TABLE `purchasehistory` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `purchaseHistoryId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`purchaseHistoryId`);

-- AlterTable
ALTER TABLE `shoppingcart` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `shoppingCartId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`shoppingCartId`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `address` JSON NOT NULL,
    ADD COLUMN `dateOfBirth` DATETIME(3) NOT NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`userId`);

-- CreateTable
CREATE TABLE `Category` (
    `categoryId` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `orderId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `orderDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`orderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderDetail` (
    `orderDetailId` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`orderDetailId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`categoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShoppingCart` ADD CONSTRAINT `ShoppingCart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_shoppingCartId_fkey` FOREIGN KEY (`shoppingCartId`) REFERENCES `ShoppingCart`(`shoppingCartId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseHistory` ADD CONSTRAINT `PurchaseHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasedProduct` ADD CONSTRAINT `PurchasedProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`productId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasedProduct` ADD CONSTRAINT `PurchasedProduct_purchaseHistoryId_fkey` FOREIGN KEY (`purchaseHistoryId`) REFERENCES `PurchaseHistory`(`purchaseHistoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;
