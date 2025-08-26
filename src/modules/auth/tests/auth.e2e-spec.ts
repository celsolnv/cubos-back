import { CreateUserDataDto } from '@/modules/web/users/dto/create-user.dto';
import { User } from '@/modules/web/users/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { initServer } from '@/test/helper/init-server';

describe('Login in app (E2E)', () => {
  let app: INestApplication;
  let database: DataSource;

  beforeAll(async () => {
    const server = await initServer();
    app = server.app;
    database = server.database;
  });
  afterAll(async () => {
    await app.close();
  });

  it('should return 200 and a token when credentials are valid', async () => {
    // Criar usuário de teste diretamente no banco
    const userRepository = database.getRepository(User);
    const hashedPassword = await hash('password123', 10);

    await userRepository.save({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      document: '12345678900',
      phone: '1234567890',
      isActive: true,
      has2fa: false,
    } as CreateUserDataDto);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(response.status).toBe(200);
  });

  it('should return 401 when credentials are invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'fulano@gmail.com',
        password: 'wrongPassword',
      });
    expect(response.status).toBe(401);
  });

  it('should return 401 when user is inactive', async () => {
    const userRepository = database.getRepository(User);
    const hashedPassword = await hash('password123', 10);

    await userRepository.save({
      email: 'inactive@example.com',
      password: hashedPassword,
      name: 'Inactive User',
      document: '12345678901',
      phone: '1234567891',
      isActive: false,
    } as CreateUserDataDto);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'inactive@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(401);
  });

  it('should return 400 when email is missing', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        password: 'password123',
      });

    expect(response.status).toBe(400);
  });

  it('should return 400 when password is missing', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'test@example.com',
      });

    expect(response.status).toBe(400);
  });

  it('should return 400 when email format is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'invalid-email',
        password: 'password123',
      });

    expect(response.status).toBe(400);
  });

  it('should return 401 when password is incorrect', async () => {
    const userRepository = database.getRepository(User);
    const hashedPassword = await hash('password123', 10);

    await userRepository.save({
      email: 'wrongpassword@example.com',
      password: hashedPassword,
      name: 'Wrong Password User',
      document: '12345678902',
      phone: '1234567892',
      isActive: true,
    } as CreateUserDataDto);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'wrongpassword@example.com',
        password: 'incorrectPassword',
      });

    expect(response.status).toBe(401);
  });
});
