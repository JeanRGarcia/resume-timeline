-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "backgroundColor" TEXT,
ADD COLUMN     "backgroundImageUrl" TEXT,
ADD COLUMN     "cardBackgroundColor" TEXT,
ADD COLUMN     "textColor" TEXT NOT NULL DEFAULT 'black';
