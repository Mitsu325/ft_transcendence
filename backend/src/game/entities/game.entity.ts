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
export class Battles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'host_id' })
  host: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'guest_id' })
  guest: User;

  @Column({ nullable: true })
  winner_score: number;

  @Column({ nullable: true })
  loser_score: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'winner' })
  winner: User;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  updated_at: Date;
}
