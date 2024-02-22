import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFriend1708205912325 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'friend',
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
                        name: 'status',
                        type: 'enum',
                        enum: ['active', 'pending', 'rejected', 'unfriended'],
                        default: "'pending'",
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
        await queryRunner.dropTable('friend');
    }
}
