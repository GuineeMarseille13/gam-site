-- AddForeignKey
ALTER TABLE "poles" ADD CONSTRAINT "poles_detailsPoleId_fkey" FOREIGN KEY ("detailsPoleId") REFERENCES "details_poles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
