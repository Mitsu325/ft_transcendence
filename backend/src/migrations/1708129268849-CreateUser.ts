import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1708129268849 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'name',
                        type: 'varchar(200)',
                    },
                    {
                        name: 'email',
                        type: 'varchar(200)',
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'username',
                        type: 'varchar(200)',
                    },
                    {
                        name: 'avatar',
                        type: 'varchar',
                    },
                    {
                        name: 'two_factor_auth',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'two_factor_secret',
                        type: 'varchar(32)',
                        default: null,
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}
