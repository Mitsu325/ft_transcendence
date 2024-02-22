import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'blocked' })
export class Blocked extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, blocker => blocker.id, {
        nullable: false,
    })
    @JoinColumn({ name: 'blocker_id' })
    blocker: User;

    @ManyToOne(() => User, blocked => blocked.id, {
        nullable: false,
    })
    @JoinColumn({ name: 'blocked_id' })
    blocked: User;

    @Column({ type: 'boolean', default: true })
    active: boolean;

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
