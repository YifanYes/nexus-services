/*
  Warnings:

  - Added the required column `orderInBoard` to the `Column` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderInColumn` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "biography" STRING;

-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "orderInBoard" INT4 NOT NULL;

-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "orderInColumn" INT4 NOT NULL;
