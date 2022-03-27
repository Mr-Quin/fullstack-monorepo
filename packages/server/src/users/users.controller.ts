import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common'
import { SqlResultDto } from '../common/dto/sql-result.dto'
import { TransformInterceptor } from '../common/interceptors/transform.interceptor'
import { ParseIdPipe } from '../common/pipes/parse-id.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { FilterUserDto } from './dto/filter-user.dto'
import { RemoveUserDto } from './dto/remove-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDetailEntity } from './entities/user-detail.entity'
import { UserEntity } from './entities/user.entity'
import { UsersService } from './users.service'
import { UserExistsPipe } from './users.pipe'

@Controller('users')
@UsePipes(new ParseIdPipe('id'))
@UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<SqlResultDto> {
        const res = await this.usersService.create(createUserDto)
        return new SqlResultDto(res)
    }

    @Get()
    async findAll(@Query() filter: FilterUserDto): Promise<UserEntity[]> {
        const data = filter.qualified
            ? await this.usersService.findQualifiedUsers()
            : await this.usersService.findAll()
        return data.map((user) => new UserEntity(user))
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<UserDetailEntity> {
        const data = await this.usersService.findOne(id)
        if (!data) throw new NotFoundException(`User with id ${id} not found`)
        return new UserDetailEntity(data)
    }

    @Patch(':id')
    async update(
        @Param('id', UserExistsPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<SqlResultDto> {
        const res = await this.usersService.update(id, updateUserDto)
        return new SqlResultDto(res)
    }

    @Delete()
    async removeMany(@Body() removeUserDto: RemoveUserDto): Promise<SqlResultDto> {
        const res = await this.usersService.removeMany(removeUserDto.user_ids)
        return new SqlResultDto(res)
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<SqlResultDto> {
        const res = await this.usersService.remove(id)
        return new SqlResultDto(res)
    }

    @Post('/validate')
    @HttpCode(HttpStatus.OK)
    validate(@Body() createUserDto: CreateUserDto) {
        // rely on the global validation pipe to validate the user
        // just return the user
        return createUserDto
    }
}
