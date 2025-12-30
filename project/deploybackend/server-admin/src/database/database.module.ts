import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
          throw new Error('❌ MONGO_URI chưa được cấu hình');
        }

        return {
          uri: mongoUri,
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
