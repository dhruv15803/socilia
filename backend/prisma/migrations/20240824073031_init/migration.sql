-- CreateTable
CREATE TABLE "Following" (
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "post_images" TEXT[],
    "post_title" TEXT NOT NULL,
    "post_content" TEXT,
    "post_author_id" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLike" (
    "liked_by_id" TEXT NOT NULL,
    "liked_post_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "comment_text" TEXT NOT NULL,
    "comment_author_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "liked_by_id" TEXT NOT NULL,
    "liked_comment_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FollowRequests" (
    "request_sender_id" TEXT NOT NULL,
    "request_receiver_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Following_follower_id_following_id_key" ON "Following"("follower_id", "following_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_liked_by_id_liked_post_id_key" ON "PostLike"("liked_by_id", "liked_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_liked_by_id_liked_comment_id_key" ON "CommentLike"("liked_by_id", "liked_comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "FollowRequests_request_sender_id_request_receiver_id_key" ON "FollowRequests"("request_sender_id", "request_receiver_id");

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_post_author_id_fkey" FOREIGN KEY ("post_author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_liked_by_id_fkey" FOREIGN KEY ("liked_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_liked_post_id_fkey" FOREIGN KEY ("liked_post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_comment_author_id_fkey" FOREIGN KEY ("comment_author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_liked_by_id_fkey" FOREIGN KEY ("liked_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_liked_comment_id_fkey" FOREIGN KEY ("liked_comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRequests" ADD CONSTRAINT "FollowRequests_request_sender_id_fkey" FOREIGN KEY ("request_sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRequests" ADD CONSTRAINT "FollowRequests_request_receiver_id_fkey" FOREIGN KEY ("request_receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
