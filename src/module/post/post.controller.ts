import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { User } from '../user/entities/user.entity';
import { UserSession } from 'src/helpers/custom-decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @UserSession() user: User
  ) {
    return this.postService.create({...createPostDto, author: user});
  }

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('orderBy') orderBy: keyof PostEntity,
    @Query('orderType') orderType: 'ASC' | 'DESC' = 'DESC',
    @Query() q: any,
    @UserSession() user: User
  ) {
    const order = orderBy ? { [orderBy]: orderType } : { id: 'DESC' as 'ASC' | 'DESC' };
    const post = await this.postService.findAll(page, pageSize, q.search, {
      authorId: user.id
    }, order);
    const postCount = await this.postService.countRows(q.search);

    return {
      totalRow: postCount,
      data: post
    };
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,    
  ) {
    return this.postService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updatePostDto: UpdatePostDto,
    @UserSession() user: User
  ) {
    return this.postService.update(+id, {...updatePostDto, author: user});
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserSession() user: User
  ) {
    return this.postService.remove(+id, user);
  }
}
