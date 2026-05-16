-- Renommage affiché du pôle (slug public inchangé : mise-en-relation)
UPDATE "poles"
SET "name" = 'Hébergement et Mise en relation'
WHERE "public_slug" = 'mise-en-relation';

UPDATE "details_poles" dp
SET "title" = 'Hébergement et Mise en relation'
FROM "poles" p
WHERE p."detailsPoleId" = dp."id"
  AND p."public_slug" = 'mise-en-relation';
