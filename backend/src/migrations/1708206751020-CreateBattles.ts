import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBattles1708206751020 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'battles',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'host_id',
                        type: 'varchar',
                    },
                    {
                        name: 'guest_id',
                        type: 'varchar',
                    },
                    {
                        name: 'winner_score',
                        type: 'number',
                        isNullable: true,
                    },
                    {
                        name: 'loser_score',
                        type: 'number',
                        isNullable: true,
                    },
                    {
                        name: 'winner',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
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
                        name: 'FKHost',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['host_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'FKGuest',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['guest_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'FKWinner',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['winner'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('battles');
    }
}
