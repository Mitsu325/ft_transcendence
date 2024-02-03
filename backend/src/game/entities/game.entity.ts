import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('battles')
export class Battle extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, host => host.id)
    @JoinColumn({ name: 'host_id' })
    host: User;

    @ManyToOne(() => User, guest => guest.id)
    @JoinColumn({ name: 'guest_id' })
    guest: User;

    @Column({ name: 'winner_score', nullable: true })
    winnerScore: number;

    @Column({ name: 'loser_score', nullable: true })
    loserScore: number;

    @ManyToOne(() => User, winner => winner.id, { nullable: true })
    @JoinColumn({ name: 'winner' })
    winner: User;

    @Column()
    status: string;

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
