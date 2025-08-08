import { ConfigService } from "@nestjs/config";
import { ClientsProviderAsyncOptions, RedisOptions, Transport } from "@nestjs/microservices";

export const redisOptions = () => {
    return {
        transport: Transport.REDIS,
        options: {
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
        }
    } as RedisOptions;
}

export const redisClientOption: ClientsProviderAsyncOptions = {
    inject: [ConfigService],
    name: 'APP_REDIS',
    useFactory: (configService: ConfigService) => ({
        transport: Transport.REDIS,
        options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
        }
    }),
}