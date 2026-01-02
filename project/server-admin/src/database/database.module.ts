import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
       useFactory: (config: ConfigService) => {
        const mongoUri = config.get<string>('MONGO_URI');
        if (!mongoUri) {
          throw new Error('❌ MONGO_URI chưa được cấu hình');
        }

        return {
          uri: mongoUri,
          serverSelectionTimeoutMS: 5000,
          connectionFactory: (connection) => {
            connection.once('open', () => Logger.log('✅ Kết nối MongoDB thành công!'));
            connection.on('error', (err) => Logger.error('❌ Kết nối MongoDB thất bại:', err.message));
            return connection;
          },
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
