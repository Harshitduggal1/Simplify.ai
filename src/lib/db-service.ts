import { prisma } from '@/utils/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { Comment, Prisma, User } from '@prisma/client';

// Define the comment type with user information
type CommentWithUser = Comment & {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  replies?: (Comment & {
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
    };
  })[];
};

export const dbService = {
  async ensureUser(clerkUserId: string): Promise<User> {
    try {
      let user = await prisma.user.findFirst({
        where: { clerkId: clerkUserId }
      });

      if (!user) {
        const clerkUser = await clerkClient.users.getUser(clerkUserId);
        user = await prisma.user.create({
          data: {
            clerkId: clerkUserId,
            name: clerkUser.firstName + ' ' + clerkUser.lastName,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            image: clerkUser.imageUrl,
          }
        });
      }

      return user;
    } catch (error) {
      console.error('Error ensuring user exists:', error);
      throw error;
    }
  },

  async createComment(data: {
    blogSlug: string;
    content: string;
    userId: string;
    parentId?: string | null;
  }): Promise<CommentWithUser> {
    try {
      const user = await this.ensureUser(data.userId);
      
      const comment = await prisma.comment.create({
        data: {
          content: data.content,
          blogSlug: data.blogSlug,
          userId: user.id,
          parentId: data.parentId || null,
          likedBy: [],
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return comment as CommentWithUser;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async getComments(blogSlug: string, sortBy: 'newest' | 'oldest' | 'mostLiked' = 'newest'): Promise<CommentWithUser[]> {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          blogSlug,
          parentId: null,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: sortBy === 'mostLiked' 
          ? { likes: 'desc' }
          : { createdAt: sortBy === 'newest' ? 'desc' : 'asc' },
      });

      return comments as CommentWithUser[];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async deleteComment(commentId: string, clerkUserId: string) {
    try {
      const user = await this.ensureUser(clerkUserId);
      return await prisma.comment.deleteMany({
        where: {
          id: commentId,
          userId: user.id,
        },
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async toggleLike(commentId: string, clerkUserId: string): Promise<{ likes: number; isLiked: boolean }> {
    try {
      const user = await this.ensureUser(clerkUserId);
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { likes: true, likedBy: true }
      });

      if (!comment) throw new Error('Comment not found');

      const isLiked = comment.likedBy.includes(user.id);

      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          likes: isLiked ? comment.likes - 1 : comment.likes + 1,
          likedBy: {
            set: isLiked 
              ? comment.likedBy.filter(id => id !== user.id)
              : [...comment.likedBy, user.id]
          }
        },
      });

      return {
        likes: updatedComment.likes,
        isLiked: !isLiked
      };
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async getCommentCount(blogSlug: string): Promise<number> {
    try {
      return await prisma.comment.count({
        where: { blogSlug },
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
};
