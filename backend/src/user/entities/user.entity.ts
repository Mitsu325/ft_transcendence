import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ unique: true, type: 'varchar', length: 200 })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    password: string;

    @Column({
        unique: true,
        type: 'varchar',
        length: 200,
        default: null,
        nullable: true,
    })
    username: string;

    @Column({ type: 'varchar', nullable: true })
    avatar: string;

    @Column({ name: 'two_factor_auth', type: 'boolean', default: false })
    twoFactorAuth: boolean;

    @Column({
        name: 'two_factor_secret',
        type: 'varchar',
        length: 32,
        default: null,
        nullable: true,
    })
    twoFactorSecret: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}
