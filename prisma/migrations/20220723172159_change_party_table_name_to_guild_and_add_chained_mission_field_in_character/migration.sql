/*
  Warnings:

  - You are about to drop the column `class` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the `CharactersOnParties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Party` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CharactersOnParties" DROP CONSTRAINT "CharactersOnParties_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharactersOnParties" DROP CONSTRAINT "CharactersOnParties_partyId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "class";
ALTER TABLE "Character" ADD COLUMN     "chainedMissions" INT4 DEFAULT 0;
ALTER TABLE "Character" ADD COLUMN     "characterClass" "Class";

-- DropTable
DROP TABLE "CharactersOnParties";

-- DropTable
DROP TABLE "Party";

-- CreateTable
CREATE TABLE "Guild" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "isActive" BOOL NOT NULL DEFAULT true,
    "name" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharactersOnGuilds" (
    "characterId" INT8 NOT NULL,
    "guildId" INT8 NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharactersOnGuilds_pkey" PRIMARY KEY ("characterId","guildId")
);

-- AddForeignKey
ALTER TABLE "CharactersOnGuilds" ADD CONSTRAINT "CharactersOnGuilds_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharactersOnGuilds" ADD CONSTRAINT "CharactersOnGuilds_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
