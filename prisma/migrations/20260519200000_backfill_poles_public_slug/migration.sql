-- Renseigne `public_slug` pour les pôles existants (création bureau / upload sans slug).

UPDATE "poles" p SET "public_slug" = 'evenementiel'
WHERE p."public_slug" IS NULL
  AND (
    p.name ILIKE '%événementiel%'
    OR p.name ILIKE '%evenementiel%'
  );

UPDATE "poles" p SET "public_slug" = 'demarche-administrative'
WHERE p."public_slug" IS NULL
  AND (
    p.name ILIKE '%démarche%' OR p.name ILIKE '%demarche%'
  )
  AND (
    p.name ILIKE '%administratif%' OR p.name ILIKE '%administrative%'
  );

UPDATE "poles" p SET "public_slug" = 'mise-en-relation'
WHERE p."public_slug" IS NULL
  AND (
    (p.name ILIKE '%mise%' AND p.name ILIKE '%relation%')
    OR p.name ILIKE '%hébergement%'
    OR p.name ILIKE '%hebergement%'
  );
