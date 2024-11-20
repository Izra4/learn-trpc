/*
  Warnings:

  - You are about to drop the `snacks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `snacks`;

-- CreateTable
CREATE TABLE `studios` (
    `id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `studios_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facilities` (
    `id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facility_studio` (
    `studio_id` VARCHAR(255) NOT NULL,
    `facility_id` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`studio_id`, `facility_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `films` (
    `id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `duration` SMALLINT NOT NULL,
    `description` TEXT NOT NULL,
    `poster` MEDIUMTEXT NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genres` (
    `id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `film_genres` (
    `film_id` VARCHAR(255) NOT NULL,
    `genre_id` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`film_id`, `genre_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `film_schedules` (
    `id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `film_id` VARCHAR(255) NOT NULL,
    `studio_id` VARCHAR(255) NOT NULL,
    `show_time` DATETIME NOT NULL,
    `price` INTEGER NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `film_schedules_film_id_studio_id_show_time_key`(`film_id`, `studio_id`, `show_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `facility_studio` ADD CONSTRAINT `facility_studio_studio_id_fkey` FOREIGN KEY (`studio_id`) REFERENCES `studios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facility_studio` ADD CONSTRAINT `facility_studio_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facilities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `film_genres` ADD CONSTRAINT `film_genres_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `film_genres` ADD CONSTRAINT `film_genres_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `film_schedules` ADD CONSTRAINT `film_schedules_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `film_schedules` ADD CONSTRAINT `film_schedules_studio_id_fkey` FOREIGN KEY (`studio_id`) REFERENCES `studios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
