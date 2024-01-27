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

@Entity()
export class ChannelAdmin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Channel, { eager: true })
    @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
    channel: Channel;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'admin_id', referencedColumnName: 'id' })
    admin: User;

    @Column({ type: 'boolean', default: false })
    active: boolean;

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
