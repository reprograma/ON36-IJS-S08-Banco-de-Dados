import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1724799484688 implements MigrationInterface {
    name = 'InitialMigration1724799484688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "minibio" text, "avatar" text, "userId" uuid, CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag_tasks_tasks" ("tagId" integer NOT NULL, "tasksId" uuid NOT NULL, CONSTRAINT "PK_9d1a1455d91d36f9fc79059a21e" PRIMARY KEY ("tagId", "tasksId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d60b92b71b1e1f31e66abbe694" ON "tag_tasks_tasks" ("tagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2064cbcf44582c43abac996d2a" ON "tag_tasks_tasks" ("tasksId") `);
        await queryRunner.query(`CREATE TABLE "tasks_tags_tag" ("tasksId" uuid NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_f85294648ceb605a0f5fa01fb5d" PRIMARY KEY ("tasksId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e956bf1e5f84518b9979bd1792" ON "tasks_tags_tag" ("tasksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_19bda941e254f4579123f4a1e8" ON "tasks_tags_tag" ("tagId") `);
        await queryRunner.query(`CREATE TABLE "user_tasks_tasks" ("userId" uuid NOT NULL, "tasksId" uuid NOT NULL, CONSTRAINT "PK_9f2db3e63c76f0d258068eee475" PRIMARY KEY ("userId", "tasksId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2db21f33b60a94ec3e3642112e" ON "user_tasks_tasks" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4cd5a88cc96c20ca604424d91c" ON "user_tasks_tasks" ("tasksId") `);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag_tasks_tasks" ADD CONSTRAINT "FK_d60b92b71b1e1f31e66abbe694b" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tag_tasks_tasks" ADD CONSTRAINT "FK_2064cbcf44582c43abac996d2a8" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks_tags_tag" ADD CONSTRAINT "FK_e956bf1e5f84518b9979bd17922" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tasks_tags_tag" ADD CONSTRAINT "FK_19bda941e254f4579123f4a1e8e" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_tasks_tasks" ADD CONSTRAINT "FK_2db21f33b60a94ec3e3642112ee" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_tasks_tasks" ADD CONSTRAINT "FK_4cd5a88cc96c20ca604424d91cc" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_tasks_tasks" DROP CONSTRAINT "FK_4cd5a88cc96c20ca604424d91cc"`);
        await queryRunner.query(`ALTER TABLE "user_tasks_tasks" DROP CONSTRAINT "FK_2db21f33b60a94ec3e3642112ee"`);
        await queryRunner.query(`ALTER TABLE "tasks_tags_tag" DROP CONSTRAINT "FK_19bda941e254f4579123f4a1e8e"`);
        await queryRunner.query(`ALTER TABLE "tasks_tags_tag" DROP CONSTRAINT "FK_e956bf1e5f84518b9979bd17922"`);
        await queryRunner.query(`ALTER TABLE "tag_tasks_tasks" DROP CONSTRAINT "FK_2064cbcf44582c43abac996d2a8"`);
        await queryRunner.query(`ALTER TABLE "tag_tasks_tasks" DROP CONSTRAINT "FK_d60b92b71b1e1f31e66abbe694b"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4cd5a88cc96c20ca604424d91c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2db21f33b60a94ec3e3642112e"`);
        await queryRunner.query(`DROP TABLE "user_tasks_tasks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19bda941e254f4579123f4a1e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e956bf1e5f84518b9979bd1792"`);
        await queryRunner.query(`DROP TABLE "tasks_tags_tag"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2064cbcf44582c43abac996d2a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d60b92b71b1e1f31e66abbe694"`);
        await queryRunner.query(`DROP TABLE "tag_tasks_tasks"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
    }

}
