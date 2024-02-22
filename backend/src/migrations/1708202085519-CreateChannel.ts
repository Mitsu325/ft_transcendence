import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateChannel1708202085519 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'channels',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'name_channel',
                        type: 'varchar(200)',
                    },
                    {
                        name: 'type',
                        type: 'varchar(50)',
                    },
                    {
                        name: 'password',
                        type: 'varchar',
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
                foreignKeys: [
                    {
                        name: 'FKChannelOwner',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['owner'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('channels');
    }
}
