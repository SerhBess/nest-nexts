import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUserName1763830672443 implements MigrationInterface {
  name = 'AddedUserName1763830672443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "username" character varying DEFAULT '' NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "username" DROP DEFAULT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "username"
    `);
  }
}
