import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { CreateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../core/file-upload/file.upload';
import { PetsService } from '../pets/pets.service';
import { PetDto } from '../pets/dto/pet.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PetsService))
    private readonly petsService: PetsService,
  ) {}

  @Get()
  async getUsersList(@Req() req: any, @Res() res: any) {
    return res
      .status(HttpStatus.OK)
      .json(await this.usersService.getUsersList());
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createUser(
    @Req() req: any,
    @Res() res: any,
    @Body() body: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      body.avatar = `public/${file.filename}`;
    }
    return res
      .status(HttpStatus.CREATED)
      .json(await this.usersService.createUser(body));
  }
  @ApiParam({ name: 'userId', required: true })
  @Get('/:userId')
  async getUserInfo(
    @Req() req: any,
    @Res() res: any,
    @Param('userId') userId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.usersService.getUserById(userId));
  }
  @Patch('/:userId')
  async updateUser() {}
  @Delete('/:userId')
  async deleteUser() {}
  @Post('/animals/:userId')
  async addNewPet(
    @Req() req: any,
    @Res() res: any,
    @Body() body: PetDto,
    @Param('userId') userId: string,
  ) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `User with id: ${userId} not fount` });
    }
    return res
      .status(HttpStatus.OK)
      .json(await this.petsService.createAnimal(body, userId));
  }
}
