/*
  Warnings:

  - You are about to alter the column `reviews` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `reviews` JSON NOT NULL;
