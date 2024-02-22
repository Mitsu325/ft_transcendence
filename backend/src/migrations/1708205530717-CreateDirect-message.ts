import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDirectMessage1708205530717 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'direct_messages',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'sender_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'recipient_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'message',
                        type: 'varchar',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKSender',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['sender_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'FKRecipient',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['recipient_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('direct_messages');
    }
}
