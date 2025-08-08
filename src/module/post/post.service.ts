import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,          
  ) { }

  create(createPostDto: CreatePostDto) {
    return this.postRepository.save(createPostDto);
  }

  async countRows(
    search?: string,
    options?: { authorId?: number }
  ) {
    let criteria: FindOptionsWhere<Post> | FindOptionsWhere<Post>[];
    if (search) {
      criteria = {        
        content: ILike(`%${search}%`)
      }
    }

    if (options?.authorId) {
      criteria = {
        ...criteria,
        author: { id: options.authorId }
      }
    }

    return this.postRepository.count({
      where: criteria,
    });
  }

  async findAll(
    page: number = 1,
    take: number = 25,
    search?: string,
    options?: { authorId?: number },
    order: { [P in keyof Post]?: 'ASC' | 'DESC' } = { id: 'DESC' }
  ) {
    let criteria: FindOptionsWhere<Post> | FindOptionsWhere<Post>[];
    if (search) {
      criteria = {
        content: ILike(`%${search}%`)
      }
    }

    if (options?.authorId) {
      criteria = {
        ...criteria,
        author: { id: options.authorId }
      }
    }

    return this.postRepository.find({
      skip: (page - 1) * take,
      take: take,
      where: criteria,
      relations: { author: true },
      order: order
    });
  }

  async findOneById(id: number) {
    if (!id) throw new BadRequestException('Param id is required');

    const post = await this.postRepository.findOne({
      where: { id },
      relations: { author: true }
    });
    if (!post) throw new NotFoundException('Post not found')

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOneById(id);
    if (!post) throw new NotFoundException('Post not found');

    if (post.author.id != updatePostDto.author.id) throw new ForbiddenException('Forbidden access post');

    if (updatePostDto.author) {      
      post.author = updatePostDto.author;
    }

    post.updatedAt = new Date();

    Object.assign(post, updatePostDto);

    return await this.postRepository.save(post);
  }

  async remove(id: number, author: User) {
    const post = await this.findOneById(id);
    if (!post) throw new NotFoundException('Post not found');

    if (post.author.id != author.id) throw new ForbiddenException('Forbidden access post');

    return await this.postRepository.softRemove({ id })
  }
}
