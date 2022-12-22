import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMigration1671633700504 implements MigrationInterface {
  name = 'UserMigration1671633700504';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_pet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "userId" integer, CONSTRAINT "FK_4eb3b1eeefc7cdeae09f934f479" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_pet"("id", "name", "userId") SELECT "id", "name", "userId" FROM "pet"`,
    );
    await queryRunner.query(`DROP TABLE "pet"`);
    await queryRunner.query(`ALTER TABLE "temporary_pet" RENAME TO "pet"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pet" RENAME TO "temporary_pet"`);
    await queryRunner.query(
      `CREATE TABLE "pet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "pet"("id", "name", "userId") SELECT "id", "name", "userId" FROM "temporary_pet"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_pet"`);
    await queryRunner.query(`DROP TABLE "pet"`);
  }
}
