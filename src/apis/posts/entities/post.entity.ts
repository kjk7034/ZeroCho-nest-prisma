import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/apis/users/entities/user.entity';
import {Image} from "./image.entity";

export class Post {
  @ApiProperty({
    description: '아이디',
  })
  postId: number;

  @ApiProperty({
    description: '게시글',
  })
  content: string;

  @ApiProperty({
    description: '작성자 아이디',
  })
  userId: string;

  @ApiProperty({
    description: '작성일',
  })
  createdAt: Date;

  @ApiProperty({
    description: '삭제일',
  })
  deletedAt?: Date;

  @ApiProperty({
    description: '작성자'
  })
  User?: User;

  @ApiProperty({
    description: '이미지 배열',
    isArray: true,
  })
  Images: Image[];
}
