import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from '../../prisma.extension';
import { User } from '../users/entities/user.entity';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class PostsService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(
    createPostDto: CreatePostDto,
    user: User,
    files: Express.Multer.File[],
  ) {
    return this.prismaService.client.post.create({
      data: {
        ...createPostDto,
        userId: user.id,
        Images: {
          createMany: {
            data: files.map((v) => ({
              link: v[0].path,
            })),
          },
        },
      },
    });
  }

  findAll(cursor: number) {
    // TODO: 추천, 팔로잉, 검색결과 구분
    const where = cursor ? { postId: { lt: cursor } } : {};
    return this.prismaService.client.post.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Reposts: true,
        Images: true,
      },
      take: 10,
    });
  }

  getSearchResult(q: string, cursor: number) {
    const where = cursor
      ? { postId: { lt: cursor }, content: { contains: q } }
      : { content: { contains: q } };
    return this.prismaService.client.post.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Reposts: true,
        Images: true,
      },
      take: 10,
    });
  }

  findUserPosts(userId: string, cursor: number) {
    const where = cursor ? { userId, postId: { lt: cursor } } : { userId };
    return this.prismaService.client.post.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Reposts: true,
        Images: true,
      },
      take: 10,
    });
  }

  findOne(id: number) {
    return this.prismaService.client.post.findUnique({
      where: { postId: id },
      include: {
        Images: true,
      },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return this.prismaService.client.post.softDelete({
      where: { postId: id },
    });
  }

  async addHeart(postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.update({
      where: { postId },
      data: {
        Hearts: {
          connect: {
            postId_userId: {
              postId,
              userId: user.id,
            },
          },
        },
      },
    });
  }

  async removeHeart(postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.update({
      where: { postId },
      data: {
        Hearts: {
          disconnect: {
            postId_userId: {
              postId,
              userId: user.id,
            },
          },
        },
      },
    });
  }

  async repost(postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.create({
      data: {
        ...original,
        userId: user.id,
        originalId: postId,
      },
      include: {
        Images: true,
      },
    });
  }

  async getComments(postId: number) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.findMany({
      where: {
        parentId: postId,
      },
      include: {
        Images: true,
      },
    });
  }

  async addComment(commentDto: CommentDto, postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.create({
      data: {
        ...commentDto,
        userId: user.id,
        parentId: postId,
      },
      include: {
        Images: true,
      },
    });
  }

  async getImage(postId: number, imageId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.postImage.findUnique({
      select: {
        Post: {
          select: {
            User: {
              select: {
                image: true,
                id: true,
                nickname: true,
              },
            },
            content: true,
            createdAt: true,
            postId: true,
          },
        },
      },
      where: {
        imageId,
        postId,
      },
    });
  }
}
