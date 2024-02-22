import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'direct_messages' })
export class DirectMessage extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, sender => sender.id, {
        nullable: false,
    })
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @ManyToOne(() => User, recipient => recipient.id, {
        nullable: false,
    })
    @JoinColumn({ name: 'recipient_id' })
    recipient: User;

    @Column({ type: 'varchar' })
    message: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
