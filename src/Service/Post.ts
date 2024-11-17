import { DeepPartial } from "typeorm";
import { Post } from "../entity/Post";
import { AppDataSource } from "..";

export class PostService {
  static async createPost(post: DeepPartial<Post>) {
    const isInvalid = this.isInvalid(post);
    if (isInvalid) {
      return { error: isInvalid.error, status: 400 };
    }

    try {
      return await AppDataSource.getRepository(Post).save(post);
    } catch (err) {
      return { error: "Error saving post", status: 500 };
    }
  }

  // TODO: Implement body validation, ex: zod or express-validator.
  private static isInvalid(post: DeepPartial<Post>) {
    post = this.trim(post);

    const postLength = post.title?.length || 0;
    const descriptionLength = post.description?.length || 0;

    if (postLength === 0 || postLength > 100) {
      return {
        error: "Post is required and must be between 1 and 100 characters",
      };
    }

    if (descriptionLength === 0 || descriptionLength > 100) {
      return {
        error: "Description is required and must be between 1 and 100 characte",
      };
    }

    if (!post.userId) {
      return { error: "User ID is required" };
    }

    return false;
  }

  private static trim(post: DeepPartial<Post>) {
    post.title = post.title?.trim();
    post.description = post.description?.trim();

    return post;
  }
}
