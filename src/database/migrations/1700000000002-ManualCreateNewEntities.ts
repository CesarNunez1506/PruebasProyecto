import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class ManualCreateNewEntities1700000000002 implements MigrationInterface {
    name = 'ManualCreateNewEntities1700000000002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create 'plan' table (no FKs to other new tables, so can be first)
        await queryRunner.createTable(
            new Table({
                name: 'plan',
                columns: [
                    { name: 'id', type: 'serial', isPrimary: true },
                    { name: 'name', type: 'varchar', isUnique: true },
                    { name: 'price', type: 'decimal', precision: 10, scale: 2 },
                    { name: 'features', type: 'text[]' }, // PostgreSQL array of text
                    { name: 'createdAt', type: 'timestamp with time zone', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updatedAt', type: 'timestamp with time zone', default: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true, // Create if not exists
        );

        // Create 'service' table
        await queryRunner.createTable(
            new Table({
                name: 'service',
                columns: [
                    { name: 'id', type: 'serial', isPrimary: true },
                    { name: 'title', type: 'varchar' },
                    { name: 'description', type: 'text' },
                    { name: 'status', type: 'varchar' }, // Enum as varchar
                    { name: 'clientId', type: 'integer' },
                    { name: 'workerId', type: 'integer', isNullable: true },
                    { name: 'createdAt', type: 'timestamp with time zone', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updatedAt', type: 'timestamp with time zone', default: 'CURRENT_TIMESTAMP' },
                    { name: 'deletedAt', type: 'timestamp with time zone', isNullable: true },
                ],
            }),
            true, // Create if not exists
        );

        await queryRunner.createForeignKey(
            'service',
            new TableForeignKey({
                name: 'FK_Service_ClientUser',
                columnNames: ['clientId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'service',
            new TableForeignKey({
                name: 'FK_Service_WorkerUser',
                columnNames: ['workerId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'SET NULL',
            }),
        );

        // Create 'review' table
        await queryRunner.createTable(
            new Table({
                name: 'review',
                columns: [
                    { name: 'id', type: 'serial', isPrimary: true },
                    { name: 'rating', type: 'integer' },
                    { name: 'comment', type: 'text', isNullable: true },
                    { name: 'serviceId', type: 'integer' },
                    { name: 'reviewerId', type: 'integer' },
                    { name: 'revieweeId', type: 'integer' },
                    { name: 'createdAt', type: 'timestamp with time zone', default: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true, // Create if not exists
        );

        await queryRunner.createForeignKey(
            'review',
            new TableForeignKey({
                name: 'FK_Review_Service',
                columnNames: ['serviceId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'service',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'review',
            new TableForeignKey({
                name: 'FK_Review_ReviewerUser',
                columnNames: ['reviewerId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'review',
            new TableForeignKey({
                name: 'FK_Review_RevieweeUser',
                columnNames: ['revieweeId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );

        // Create 'subscription' table
        await queryRunner.createTable(
            new Table({
                name: 'subscription',
                columns: [
                    { name: 'id', type: 'serial', isPrimary: true },
                    { name: 'planId', type: 'integer' },
                    { name: 'workerId', type: 'integer' },
                    { name: 'startDate', type: 'timestamp with time zone' },
                    { name: 'endDate', type: 'timestamp with time zone' },
                    { name: 'status', type: 'varchar' }, // Enum as varchar
                    { name: 'createdAt', type: 'timestamp with time zone', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updatedAt', type: 'timestamp with time zone', default: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true, // Create if not exists
        );

        await queryRunner.createForeignKey(
            'subscription',
            new TableForeignKey({
                name: 'FK_Subscription_Plan',
                columnNames: ['planId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'plan',
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'subscription',
            new TableForeignKey({
                name: 'FK_Subscription_WorkerUser',
                columnNames: ['workerId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );

        // Create 'availability' table
        await queryRunner.createTable(
            new Table({
                name: 'availability',
                columns: [
                    { name: 'id', type: 'serial', isPrimary: true },
                    { name: 'workerId', type: 'integer' },
                    { name: 'dayOfWeek', type: 'varchar' }, // Enum as varchar
                    { name: 'startTime', type: 'time' },
                    { name: 'endTime', type: 'time' },
                    { name: 'createdAt', type: 'timestamp with time zone', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updatedAt', type: 'timestamp with time zone', default: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true, // Create if not exists
        );

        await queryRunner.createForeignKey(
            'availability',
            new TableForeignKey({
                name: 'FK_Availability_WorkerUser',
                columnNames: ['workerId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order of creation, TypeORM's dropTable should handle FKs.
        // If not, FKs must be dropped manually first.

        // Drop 'availability'
        await queryRunner.dropForeignKey('availability', 'FK_Availability_WorkerUser');
        await queryRunner.dropTable('availability');

        // Drop 'subscription'
        await queryRunner.dropForeignKey('subscription', 'FK_Subscription_WorkerUser');
        await queryRunner.dropForeignKey('subscription', 'FK_Subscription_Plan');
        await queryRunner.dropTable('subscription');

        // Drop 'review'
        await queryRunner.dropForeignKey('review', 'FK_Review_RevieweeUser');
        await queryRunner.dropForeignKey('review', 'FK_Review_ReviewerUser');
        await queryRunner.dropForeignKey('review', 'FK_Review_Service');
        await queryRunner.dropTable('review');

        // Drop 'service'
        await queryRunner.dropForeignKey('service', 'FK_Service_WorkerUser');
        await queryRunner.dropForeignKey('service', 'FK_Service_ClientUser');
        await queryRunner.dropTable('service');

        // Drop 'plan'
        await queryRunner.dropTable('plan');
    }
}
