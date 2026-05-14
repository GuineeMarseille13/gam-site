-- Visibilité des rapports d'activité sur le site public
ALTER TABLE "report_activities" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true;
