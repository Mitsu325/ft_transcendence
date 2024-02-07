import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Channel } from '../../channel/entities/channel.entity';

export type ActionType = 'kick' | 'ban' | 'mute';

@Entity()
export class AdminAction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Channel, { eager: true })
    @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
    channel: Channel;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
    admin: User;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
    member: User;

    @Column({
        type: 'enum',
        enum: ['kick', 'ban', 'mute'],
    })
    action: ActionType;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @Column({
        name: 'expiration_date',
        type: 'timestamptz',
        nullable: true,
    })
    expirationDate: Date;

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
