import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  var cors = require("cors");
  const corsOptions = {
    origin: ["https://address-api2.herokuapp.com"],
    credentials: true,
  }
  app.enableCors();
  app.use(cors(corsOptions));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
