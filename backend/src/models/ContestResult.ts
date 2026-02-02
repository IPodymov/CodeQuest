import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Contest } from "./Contest";

@Entity()
export class ContestResult {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, (user) => user.results, { onDelete: "CASCADE" })
    user!: User;

    @ManyToOne(() => Contest, { eager: true, onDelete: "CASCADE" })
    contest!: Contest;

    @Column({ type: "int", default: 0 })
    rank!: number;

    @Column({ type: "int", default: 0 })
    solved!: number;

    @Column({ type: "int", default: 0 })
    ratingDelta!: number;

    @Column({ type: "boolean", default: false })
    isWinner!: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;
}
