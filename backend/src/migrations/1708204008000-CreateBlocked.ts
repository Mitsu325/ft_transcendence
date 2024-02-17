import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBlocked1708204008000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'blocked',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'blocker_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'blocked_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'active',
                        type: 'boolean',
                        default: true,
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
                        name: 'FKBlocker',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['blocker_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'FKBlocked',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['blocked_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('blocked');
    }
}
