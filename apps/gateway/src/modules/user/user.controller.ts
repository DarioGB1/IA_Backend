import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from '@app/shared';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) { }

    @Get(':id')
    async getById(@Param('id', ParseUUIDPipe) id: string) {
        return await this.userService.findById(id);
    }

    @Patch(':id')
    async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() userUpdateDto: UserUpdateDto) {
        return await this.userService.update({ id, updateData: userUpdateDto });
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.userService.delete(id);
        return { message: `User ${id} deleted` };
    }
}
