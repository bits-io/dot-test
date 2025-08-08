import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, DeleteDateColumn, OneToOne, Column } from 'typeorm';
import { DateTimeTransformer } from 'src/helpers/datetime-transformer';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

/**
 * Moved the password to tenant level
 * so the users has ability to update it.
 */

@Entity()
export class UserPassword {
  @PrimaryGeneratedColumn()
  id?: number;

  @OneToOne(() => User, { onUpdate: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Exclude()
  @Column({ type: 'text' })
  password: string;

  @CreateDateColumn({ type: 'timestamp', transformer: new DateTimeTransformer() })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', transformer: new DateTimeTransformer() })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
