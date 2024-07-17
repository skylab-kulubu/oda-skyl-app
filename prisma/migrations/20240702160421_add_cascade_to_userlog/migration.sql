-- DropForeignKey
ALTER TABLE "UserLog" DROP CONSTRAINT "UserLog_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserLog" ADD CONSTRAINT "UserLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
