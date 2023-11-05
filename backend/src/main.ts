import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Documentação com Swagger - Fábrica de Sinapse')
        .setDescription(
            'O Swagger (aka OpenApi) é uma biblioteca muito conhecida no universo backend, estando disponível para diversas linguagens e frameworks. Ela gera um site interno no seu backend que descreve, com muitos detalhes, cada endpoint e estrutura de entidades presentes na sua aplicação.',
        )
        .setVersion('1.0')
        .addTag('auth')
        .addTag('user')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.enableCors({
        allowedHeaders: '*',
        origin: 'http://localhost:3000',
        credentials: true,
    });

    await app.listen(3003);
    app.enableCors({
        allowedHeaders: '*',
        origin: 'http://localhost:3000',
        credentials: true,
    });

    await app.listen(3003);
}
bootstrap();
