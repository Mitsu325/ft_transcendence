import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Channel } from './channel.entity';

@Entity({ name: 'messages-ch' })
export class Messages {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Channel, { eager: true })
    @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
    channel_id: Channel;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
    sender_id: User;

    @Column({ type: 'varchar' })
    message: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
