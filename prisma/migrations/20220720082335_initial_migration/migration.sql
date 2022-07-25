-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ROOT', 'TASK_MASTER', 'USER');

-- CreateEnum
CREATE TYPE "Class" AS ENUM ('ASSASSIN', 'WARRIOR', 'MAGE', 'BARD');

-- CreateTable
CREATE TABLE "Character" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "isActive" BOOL NOT NULL DEFAULT true,
    "isAlive" BOOL NOT NULL DEFAULT true,
    "username" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "profilePhoto" STRING,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "class" "Class",
    "hp" INT4,
    "maxHp" INT4,
    "experience" INT4,
    "level" INT4,
    "stress" FLOAT8,
    "maximumMissionNumber" INT4,
    "currentMissionNumber" INT4,
    "resistance" FLOAT8,
    "performance" FLOAT8,
    "trust" FLOAT8,
    "weekendDays" INT4 DEFAULT 2,
    "daysOffWork" INT4 DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "isActive" BOOL NOT NULL DEFAULT true,
    "name" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharactersOnParties" (
    "characterId" INT8 NOT NULL,
    "partyId" INT8 NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharactersOnParties_pkey" PRIMARY KEY ("characterId","partyId")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,
    "description" STRING,
    "isActive" BOOL NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Column" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "boardId" INT8 NOT NULL,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "isCompleted" BOOL NOT NULL DEFAULT false,
    "title" STRING NOT NULL,
    "description" STRING,
    "difficulty" INT4 NOT NULL,
    "requirements" STRING[],
    "sinergy" INT4 NOT NULL,
    "stress" FLOAT8 NOT NULL,
    "estimatedTime" FLOAT8 NOT NULL,
    "completionTime" FLOAT8,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "columnId" INT8 NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionsOnCharacters" (
    "characterId" INT8 NOT NULL,
    "missionId" INT8 NOT NULL,

    CONSTRAINT "MissionsOnCharacters_pkey" PRIMARY KEY ("characterId","missionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_username_key" ON "Character"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Character_email_key" ON "Character"("email");

-- AddForeignKey
ALTER TABLE "CharactersOnParties" ADD CONSTRAINT "CharactersOnParties_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharactersOnParties" ADD CONSTRAINT "CharactersOnParties_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionsOnCharacters" ADD CONSTRAINT "MissionsOnCharacters_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionsOnCharacters" ADD CONSTRAINT "MissionsOnCharacters_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
