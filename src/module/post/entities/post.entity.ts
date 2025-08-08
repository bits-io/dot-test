import { DateTimeTransformer } from "src/helpers/datetime-transformer";
import { User } from "src/module/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'text', nullable: true })
    content: string;

    @ManyToOne(() => User)
    @JoinColumn()
    author: User;

    @CreateDateColumn({ type: 'timestamp', transformer: new DateTimeTransformer() })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', transformer: new DateTimeTransformer() })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
