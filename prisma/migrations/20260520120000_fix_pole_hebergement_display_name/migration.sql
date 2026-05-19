-- Corrige le libellé affiché du pôle (nom en base encore « Mise en relation » sur certains environnements).
UPDATE "poles"
SET
  "name" = 'Hébergement et Mise en relation',
  "public_slug" = COALESCE("public_slug", 'mise-en-relation')
WHERE "public_slug" = 'mise-en-relation'
   OR (
     "name" ILIKE '%mise%'
     AND "name" ILIKE '%relation%'
     AND "name" NOT ILIKE '%hébergement%'
     AND "name" NOT ILIKE '%hebergement%'
   );

UPDATE "details_poles" dp
SET "title" = 'Hébergement et Mise en relation'
FROM "poles" p
WHERE p."detailsPoleId" = dp."id"
  AND (
    p."public_slug" = 'mise-en-relation'
    OR p."name" = 'Hébergement et Mise en relation'
  );
