import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { Post as PostEntity } from '../post/entities/post.entity';
import { PostService } from '../post/post.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
    private readonly postService: PostService,
  ) {}

  @Get('/post')
  async findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('orderBy') orderBy: keyof PostEntity,
    @Query('orderType') orderType: 'ASC' | 'DESC' = 'DESC',
    @Query() q: any,
  ) {
    const order = orderBy ? { [orderBy]: orderType } : { id: 'DESC' as 'ASC' | 'DESC' };
    const post = await this.postService.findAll(page, pageSize, q.search, {
      authorId: q.authorId
    }, order);
    const postCount = await this.postService.countRows(q.search);
  
    return {
      totalRow: postCount,
      data: post
    };
  }
  
  @Get('/post/:id')
  findOne(@Param('id') id: string) {
    return this.postService.findOneById(+id);
  }

}
