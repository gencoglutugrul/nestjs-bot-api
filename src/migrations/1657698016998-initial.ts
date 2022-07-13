import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1657698016998 implements MigrationInterface {
  name = 'Initial1657698016998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "request_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "loginUrl" varchar NOT NULL, "jobId" integer NOT NULL, CONSTRAINT "REL_64ca6d83afbcf88b662e4f03de" UNIQUE ("jobId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "job_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar(255) NOT NULL, "processedOn" datetime, "finishedOn" datetime, "result" varchar, "isCompleted" boolean NOT NULL DEFAULT (0), "isFailed" boolean NOT NULL DEFAULT (0))`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
