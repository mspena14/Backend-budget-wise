import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class AuditableEntity {
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => `CURRENT_TIMESTAMP`,
        select: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => `CURRENT_TIMESTAMP`,
        onUpdate: `CURRENT_TIMESTAMP`,
        select: false,
    })
    updatedAt: Date;

    
    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        select: false,
    })
    deletedAt: Date;
}