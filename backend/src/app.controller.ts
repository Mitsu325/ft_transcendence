import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/constants';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiOperation({ description: 'Hello World' })
    @Public()
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
