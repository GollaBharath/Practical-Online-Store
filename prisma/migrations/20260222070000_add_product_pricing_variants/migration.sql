-- Add colorPrice and bwPrice columns (default 0)
ALTER TABLE "Product" ADD COLUMN "colorPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN "bwPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Migrate existing price → colorPrice so current products remain visible
UPDATE "Product" SET "colorPrice" = "price";

-- Drop the old price column
ALTER TABLE "Product" DROP COLUMN "price";
