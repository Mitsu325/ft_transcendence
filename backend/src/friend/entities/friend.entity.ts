import { User } from 'src/user/entities/user.entity';
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

export type FriendStatusType = 'active' | 'pending' | 'rejected' | 'unfriended';

@Entity({ name: 'friend' })
export class Friend extends BaseEntity {
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

    @Column({
        type: 'enum',
        enum: ['active', 'pending', 'rejected', 'unfriended'],
        default: 'pending',
    })
    status: FriendStatusType;

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
