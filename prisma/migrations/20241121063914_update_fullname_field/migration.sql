/*
  Warnings:

  - You are about to alter the column `show_time` on the `film_schedules` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Made the column `fullname` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `film_schedules` MODIFY `show_time` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `fullname` VARCHAR(255) NOT NULL;
