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

@Entity()
export class Messages {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Channel, channel => channel.id)
    @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
    channel_id: Channel;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
    sender_id: User;

    @Column()
    message: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
