import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Info } from "./info.entity";
import { Role } from "../enums/role.enum";
import * as bcrypt from "bcrypt";
import { Contact } from "./contact.entity";
import { Status } from "../enums/status.enum";
import { Exclude } from "class-transformer";
import { IsEmail, IsEnum, IsString, IsOptional, IsDate, IsArray, IsNumber } from "class-validator";

@Entity({name: "User"})
export class User {
    /**
     * Unique identifier for the user (Primary Key)
     */
    @PrimaryGeneratedColumn({})
    @IsNumber()
    id:number;
     
    /**
     * Unique email address of the user
     */
    @Column({unique: true})
    @IsEmail()
    email: string;

    /**
     * Hashed password for the user (excluded from serialization)
     */
    @Exclude()
    @Column({default: "password"})
    @IsString()
    password: string;

    /**
     * Role of the user (admin, director, manager)
     */
    @Column({type: 'text', enum: Role, default: Role.manager})
    @IsEnum(Role)
    role: Role;

    /**
     * Status of the user (active, inactive, etc.)
     */
    @Column({default: Status.active})
    @IsEnum(Status)
    status: Status;

    /**
     * Date when the user was created
     */
    @CreateDateColumn({default: Date.now()})
    @IsDate()
    createdAt: Date;

    /**
     * One-to-one relation to Info entity (user's personal info)
     */
    @OneToOne((type) => Info, info => info.user) 
    @IsOptional()
    info: Info;

    /**
     * One-to-one relation to Contact entity (user's contact info)
     */
    @OneToOne((type) => Contact, contact => contact.user)
    @IsOptional()
    contact: Contact;

    

    /**
     * Validates a plain password against the user's hashed password
     * @param password Plain password to validate
     * @returns Promise<boolean> indicating if password is valid
     */
    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    /**
     * Hashes a plain password using bcrypt
     * @param password Plain password to hash
     * @returns Promise<string> hashed password
     */
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10); // 10 salt rounds 
    }
}


