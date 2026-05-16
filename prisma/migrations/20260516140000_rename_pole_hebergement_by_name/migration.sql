-- Renommage même si public_slug est NULL (jeux de données sans slug public renseigné)
UPDATE "poles"
SET
  "name" = 'Hébergement et Mise en relation',
  "public_slug" = COALESCE("public_slug", 'mise-en-relation')
WHERE "name" ILIKE '%mise%'
  AND "name" ILIKE '%relation%';

UPDATE "details_poles" dp
SET "title" = 'Hébergement et Mise en relation'
FROM "poles" p
WHERE p."detailsPoleId" = dp."id"
  AND (
    p."public_slug" = 'mise-en-relation'
    OR (p."name" ILIKE '%hébergement%' AND p."name" ILIKE '%relation%')
    OR (dp."title" ILIKE '%mise%' AND dp."title" ILIKE '%relation%')
  );
