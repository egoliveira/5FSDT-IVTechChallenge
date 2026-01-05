import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('subject')
export class SubjectEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 255,
        nullable: false,
    })
    name: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp'
    })
    updatedAt: Date;

    constructor(id?: number, name?: string, createdAt?: Date, updatedAt?: Date) {
        if (id) {
            this.id = id;
        } else {
            this.id = 0
        }

        if (name) {
            this.name = name;
        } else {
            this.name = '';
        }

        if (createdAt) {
            this.createdAt = createdAt;
        } else {
            this.createdAt = new Date();
        }

        if (updatedAt) {
            this.updatedAt = updatedAt;
        } else {
            this.updatedAt = new Date();
        }
    }
}