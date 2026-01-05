import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
        nullable: false,
        unique: true
    })
    username: string;

    @Column({
        length: 255,
        nullable: false
    })
    name: string;

    @Column({
        length: 100,
        nullable: false
    })
    email: string;

    @Column({
        length: 255,
        nullable: false
    })
    password: string;

    @Column({
        nullable: false
    })
    active: boolean;

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

    constructor(id?: number, username?: string, name?: string, email?: string, password?: string, active?: boolean, createdAt?: Date, updatedAt?: Date) {
        if (id) {
            this.id = id;
        } else {
            this.id = 0
        }

        if (username) {
            this.username = username;
        } else {
            this.username = '';
        }

        if (name) {
            this.name = name;
        } else {
            this.name = '';
        }

        if (email) {
            this.email = email;
        } else {
            this.email = '';
        }

        if (password) {
            this.password = password;
        } else {
            this.password = '';
        }

        if (active) {
            this.active = active;
        } else {
            this.active = false;
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