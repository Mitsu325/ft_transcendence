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
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'host_id' })
    host: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'guest_id' })
    guest: string;

    @Column({ nullable: true })
    winner_score: number;

    @Column({ nullable: true })
    loser_score: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'winner' })
    winner: string;

    @Column()
    status: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at: Date;
}
