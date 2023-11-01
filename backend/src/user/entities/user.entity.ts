import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ type: 'varchar', length: 200 })
    username: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    avatar: string;

    @Column({ name: 'two_factor_auth', type: 'boolean', default: false })
    twoFactorAuth: boolean;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}
