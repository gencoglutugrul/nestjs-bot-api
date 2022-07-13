import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordToRequestEntity1657708756844
  implements MigrationInterface
{
  name = 'AddPasswordToRequestEntity1657708756844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_request_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "loginUrl" varchar NOT NULL, "jobId" integer NOT NULL, "password" varchar NOT NULL, CONSTRAINT "REL_64ca6d83afbcf88b662e4f03de" UNIQUE ("jobId"), CONSTRAINT "FK_64ca6d83afbcf88b662e4f03de7" FOREIGN KEY ("jobId") REFERENCES "job_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_request_entity"("id", "username", "loginUrl", "jobId") SELECT "id", "username", "loginUrl", "jobId" FROM "request_entity"`,
    );
    await queryRunner.query(`DROP TABLE "request_entity"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_request_entity" RENAME TO "request_entity"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "request_entity" RENAME TO "temporary_request_entity"`,
    );
    await queryRunner.query(
      `CREATE TABLE "request_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "loginUrl" varchar NOT NULL, "jobId" integer NOT NULL, CONSTRAINT "REL_64ca6d83afbcf88b662e4f03de" UNIQUE ("jobId"), CONSTRAINT "FK_64ca6d83afbcf88b662e4f03de7" FOREIGN KEY ("jobId") REFERENCES "job_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "request_entity"("id", "username", "loginUrl", "jobId") SELECT "id", "username", "loginUrl", "jobId" FROM "temporary_request_entity"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_request_entity"`);
  }
}
