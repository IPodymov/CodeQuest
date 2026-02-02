import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Contest {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar"})
    title!: string;

    @Column({type: "varchar"})
    platform!: string;

    @Column({type: "timestamp"})
    startTime!: Date;

    @Column({type: "varchar", nullable: true})
    duration?: string | null;

    @Column({type: "varchar", nullable: true})
    url?: string | null;

    @Column({type: "text", nullable: true})
    description?: string | null;

    @Column({type: "varchar", nullable: true})
    difficulty?: string | null;

    @Column({type: "varchar", nullable: true})
    icon?: string | null;

    @Column({type: "text", nullable: true})
    imageUrl?: string | null;

    @Column({type: "varchar", nullable: true})
    background?: string | null;
}
