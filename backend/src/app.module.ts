import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { RequirementsModule } from './requirements/requirements.module';
import { OptionsModule } from './options/options.module';
import { DesignsModule } from './designs/designs.module';
import { FesModule } from './fes/fes.module';
import { BesModule } from './bes/bes.module';
import { EnvsModule } from './envs/envs.module';
import { DelsModule } from './dels/dels.module';
import { AiPromptModule } from './ai-prompt/ai-prompt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    RequirementsModule,
    OptionsModule,
    DesignsModule,
    FesModule,
    BesModule,
    EnvsModule,
    DelsModule,
    AiPromptModule,
  ],
})
export class AppModule {}
