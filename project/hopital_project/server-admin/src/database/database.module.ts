import { Module , Logger} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://quanta2309ppvDB:20225386Quan.TM225386@cluster0.ga1mv8i.mongodb.net/?appName=Cluster0',
      {
        // callback connection
        connectionFactory: (connection) => {
          connection.once('open', () => {
            Logger.log('Kết nối MongoDB thành công!');
          });
          connection.on('error', (err) => {
            Logger.error(' Kết nối MongoDB thất bại:', err.message);
          });
          return connection;
        },
      }
    ),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
