import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class ManualUpdateUserEntity1700000000001 implements MigrationInterface {
    name = 'ManualUpdateUserEntity1700000000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add userType column
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'userType',
                type: 'varchar',
                isNullable: true, // Assuming UserType might not be set for all existing users initially
            }),
        );

        // Add phone column
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'phone',
                type: 'varchar',
                isNullable: true,
            }),
        );

        // Add address column
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'address',
                type: 'varchar',
                isNullable: true,
            }),
        );

        // Add documentType column
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'documentType',
                type: 'varchar',
                isNullable: true,
            }),
        );

        // Add documentFileId column (foreign key to FileEntity)
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'documentFileId',
                type: 'integer', // Assuming id in FileEntity is integer
                isNullable: true,
            }),
        );

        // Add verificationStatus column
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'verificationStatus',
                type: 'varchar',
                isNullable: true,
                default: "'PENDING'", // Default value as string literal for SQL
            }),
        );

        // Create foreign key for documentFileId
        await queryRunner.createForeignKey(
            'user',
            new TableForeignKey({
                name: 'FK_User_DocumentFile', // Explicit FK name
                columnNames: ['documentFileId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'file', // Assuming 'file' is the table name for FileEntity
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key
        await queryRunner.dropForeignKey('user', 'FK_User_DocumentFile');

        // Drop columns in reverse order of addition
        await queryRunner.dropColumn('user', 'verificationStatus');
        await queryRunner.dropColumn('user', 'documentFileId');
        await queryRunner.dropColumn('user', 'documentType');
        await queryRunner.dropColumn('user', 'address');
        await queryRunner.dropColumn('user', 'phone');
        await queryRunner.dropColumn('user', 'userType');
    }
}
