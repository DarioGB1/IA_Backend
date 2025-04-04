import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL ?? '', {
      appName: 'ai-learn',
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
