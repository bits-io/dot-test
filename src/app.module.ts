import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './module/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './module/auth/auth.middleware';
import { DatabaseConfig } from './configs/database';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { PublicModule } from './module/public/public.module';
import { PostModule } from './module/post/post.module';
import { DeepSeekModule } from './module/deep-seek/deep-seek.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseConfig,
    AuthModule,
    UserModule,
    PublicModule,
    PostModule,
    DeepSeekModule,    
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthMiddleware,
      ).forRoutes('*');
  }
}

