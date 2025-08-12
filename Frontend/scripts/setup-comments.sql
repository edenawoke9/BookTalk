-- Comments functionality is already set up in your schema!
-- Your existing schema.prisma already includes the Comment model
-- with the relationship to Book model.

-- Here's what you already have:
-- model Comment {
--   id     Int     @id @default(autoincrement())
--   body   String
--   date   DateTime
--   book   Book     @relation(fields: [bookId], references: [id])
--   bookId Int
--   @@map("comments")
-- }

-- To fully implement comments, you'll need to update your backend:

-- 1. Create a comments controller (similar to books.js)
-- 2. Add comment routes to your routes.js
-- 3. Update the Comment model to include user relationship

-- Suggested schema update for user relationship:
-- ALTER TABLE "public"."comments" ADD COLUMN "userId" INTEGER;
-- ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_userId_fkey" 
-- FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Sample data for testing (optional):
INSERT INTO "public"."comments" (body, date, "bookId") VALUES 
('This book completely changed my perspective on the genre. Highly recommended!', NOW(), 1),
('Amazing character development and plot twists. Could not put it down!', NOW(), 1),
('A masterpiece of modern literature. The themes are very relevant.', NOW(), 2);
