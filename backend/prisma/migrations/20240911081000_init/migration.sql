-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "reply_message_id" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_reply_message_id_fkey" FOREIGN KEY ("reply_message_id") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
