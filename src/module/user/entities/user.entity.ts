import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import UserType from '../enums/user-type';
import { DateTimeTransformer } from 'src/helpers/datetime-transformer';
import { UserPassword } from './user-password.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  userType: UserType;
  
  @Column({ nullable: true })
  isActive: boolean;

  @Exclude()
  @OneToOne(() => UserPassword, (e) => e.user)
  password: UserPassword;

  @Column({ nullable: true, type: 'text' })
  resetPasswordToken: string;

  @CreateDateColumn({ type: 'timestamp', transformer: new DateTimeTransformer() })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', transformer: new DateTimeTransformer() })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
