import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRefreshTokens1763910725156 implements MigrationInterface {
    name = 'AddedRefreshTokens1763910725156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
    }

}
