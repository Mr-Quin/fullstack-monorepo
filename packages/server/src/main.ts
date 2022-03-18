import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { WsAdapter } from '@nestjs/platform-ws'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['log', 'verbose'] })
    // allow validation to use nest dependency injection
    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            skipMissingProperties: false,
            transformOptions: {
                enableImplicitConversion: true,
            },
        })
    )
        .setGlobalPrefix('api')
        .useWebSocketAdapter(new WsAdapter(app))
    await app.listen(3000)
}

bootstrap()
