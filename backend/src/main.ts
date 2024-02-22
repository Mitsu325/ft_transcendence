import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useLogger(Logger);
    const config = new DocumentBuilder()
        .setTitle('Documentação com Swagger')
        .setDescription(
            'O Swagger (aka OpenApi) é uma biblioteca muito conhecida no universo backend, estando disponível para diversas linguagens e frameworks. Ela gera um site interno no seu backend que descreve, com muitos detalhes, cada endpoint e estrutura de entidades presentes na sua aplicação.',
        )
        .setVersion('1.0')
        .addTag('auth')
        .addTag('user')
        .addTag('chat')
        .addTag('battles')
        .addTag('friend')
        .addBearerAuth(
            {
                description: `Please enter token in following format: Bearer <JWT>`,
                name: 'Authorization',
                bearerFormat: 'Bearer',
                scheme: 'Bearer',
                type: 'http',
                in: 'Header',
            },
            'access-token',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });

    app.use(function (request, response, next) {
        response.header('Access-Control-Allow-Origin', '*');
        next();
    });

    await app.listen(3003);
}
bootstrap();
