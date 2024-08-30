import { Request, Response } from "express";
import { client } from "..";

type createCommentRequestBody = {
  post_id: string;
  comment_text: string;
  parent_comment_id?: string;
};

const createComment = async (req: Request, res: Response) => {
  try {
    const { post_id, comment_text, parent_comment_id } =
      req.body as createCommentRequestBody;
    if (comment_text.trim() === "")
      return res
        .status(400)
        .json({ success: false, message: "comment text is empty" });
    const userId = req.userId;
    const user = await client.user.findUnique({ where: { id: userId } });
    const post = await client.post.findUnique({ where: { id: post_id } });
    if (!user || !post)
      return res
        .status(400)
        .json({ success: false, message: "invalid userid" });

    const comment = await client.comment.create({
      data: {
        comment_text: comment_text.trim(),
        comment_author_id: user.id,
        post_id: post.id,
        parent_comment_id: parent_comment_id ? parent_comment_id : null,
      },
      include: {
        _count: { select: { CommentLike: true } },
        comment_author: {
          select: {
            id: true,
            username: true,
            user_image: true,
            email: true,
          },
        },
        CommentLike: {
          select: {
            liked_by: {
              select: {
                id: true,
                username: true,
                email: true,
                user_image: true,
              },
            },
          },
        },
        parent_comment:{
            select:{
                comment_author:{
                    select:{
                        id:true,
                        email:true,
                        username:true,
                        user_image:true,
                    }
                }
            }
        },
      },
    });

    return res.status(201).json({ success: true, comment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong when creating comment",
      });
  }
};

const fetchPostComments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = page * limit - limit;
    const { postId } = req.params;
    const post = await client.post.findUnique({ where: { id: postId } });
    if (!post)
      return res
        .status(400)
        .json({ success: false, message: "invalid postid" });
    const comments = await client.comment.findMany({
      where: { post_id: post.id, parent_comment_id: null },
      include: {
        _count: { select: { CommentLike: true, child_comments: true } },
        comment_author: {
          select: {
            id: true,
            username: true,
            email: true,
            user_image: true,
          },
        },
        CommentLike: {
          select: {
            liked_by: {
              select: {
                id: true,
                username: true,
                email: true,
                user_image: true,
              },
            },
          },
        },
        parent_comment:{
            select:{
                comment_author:{
                    select:{
                        id:true,
                        email:true,
                        username:true,
                        user_image:true,
                    }
                }
            }
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: limit,
    });
    const total = await client.comment.count({ where: { post_id: post.id } });
    return res
      .status(200)
      .json({ success: true, comments, noOfPages: Math.ceil(total / limit) });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong when fetching post comments",
      });
  }
};

const fetchChildComments = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = page * limit - limit;
        const { parent_comment_id } = req.params;
        const parent_comment = await client.comment.findUnique({
          where: { id: parent_comment_id },
        });
        if (!parent_comment)
          return res
            .status(400)
            .json({ success: false, message: "parent comment not found" });
        const child_comments = await client.comment.findMany({
          where: { parent_comment_id: parent_comment_id },
          include: {
            _count: { select: { CommentLike: true, child_comments: true } },
            comment_author: {
              select: {
                id: true,
                username: true,
                email: true,
                user_image: true,
              },
            },
            CommentLike: {
              select: {
                liked_by: {
                  select: {
                    id: true,
                    email: true,
                    username: true,
                    user_image: true,
                  },
                },
              },
            },
            parent_comment:{
                select:{
                    comment_author:{
                        select:{
                            id:true,
                            email:true,
                            username:true,
                            user_image:true,
                        }
                    }
                }
            }
          },
          orderBy: { createdAt: "desc" },
          skip: skip,
          take: limit,
        });
      
        const total = await client.comment.count({where:{parent_comment_id:parent_comment_id}});
        res.status(200).json({"success":true,child_comments,"noOfPages":Math.ceil(total/limit)});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success":false,"message":"Something went wrong when fetching child comments"});
    }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;
    const comment = await client.comment.findUnique({
      where: { id: commentId },
    });
    const user = await client.user.findUnique({ where: { id: userId } });
    if (!comment || !user)
      return res
        .status(400)
        .json({ success: false, message: "user or comment not found" });

    // check if comments author is the current authenticated user
    let responseMsg = "";
    let isDelete = false;
    if (comment.comment_author_id === user.id) {
      await client.comment.delete({ where: { id: comment.id } });
      isDelete = true;
      responseMsg = "comment deleted";
    } else {
      isDelete = false;
      responseMsg = "user not author of comment";
    }

    return res
      .status(200)
      .json({ success: true, message: responseMsg, isDelete });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong when deleting comment",
      });
  }
};

const likeComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.body as { commentId: string };
    const userId = req.userId;
    const user = await client.user.findUnique({ where: { id: userId } });
    const comment = await client.comment.findUnique({
      where: { id: commentId },
    });
    if (!user || !comment)
      return res
        .status(400)
        .json({ success: false, message: "comment or user not found" });

    // if there is already a like on comment by user => remove like else add like
    // 1. check like
    let isLiked = false;
    let responseMsg = "";
    const liked = await client.commentLike.findUnique({
      where: {
        liked_by_id_liked_comment_id: {
          liked_by_id: user.id,
          liked_comment_id: comment.id,
        },
      },
    });
    if (liked) {
      // remove like
      await client.commentLike.delete({
        where: {
          liked_by_id_liked_comment_id: {
            liked_by_id: liked.liked_by_id,
            liked_comment_id: liked.liked_comment_id,
          },
        },
      });
      isLiked = false;
      responseMsg = "unliked comment";
    } else {
      const newLike = await client.commentLike.create({
        data: {
          liked_by_id: user.id,
          liked_comment_id: comment.id,
        },
      });
      isLiked = true;
      responseMsg = "liked comment";
    }

    return res
      .status(200)
      .json({ success: true, message: responseMsg, isLiked });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong when liking comment",
      });
  }
};

export { createComment, fetchPostComments, deleteComment, likeComment ,fetchChildComments};
