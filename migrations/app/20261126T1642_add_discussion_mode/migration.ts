#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/b4ccd8c8e797d6bc2e79d73e3804929324f4e71f5c83d8d20d56afc2d9ce1469/contract';
import startContract from '../../snapshots/b4ccd8c8e797d6bc2e79d73e3804929324f4e71f5c83d8d20d56afc2d9ce1469/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f54d2b9a53c769b2517be61754b0fa0b17a8c597fc1a9f811c07376a29036cef/contract';
import endContract from '../../snapshots/f54d2b9a53c769b2517be61754b0fa0b17a8c597fc1a9f811c07376a29036cef/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'quizCompletionRecord',
        constraint: 'quizCompletionRecord_sourceType_check_88db0880',
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'quizPackage',
        constraint: 'quizPackage_assignmentMode_check_da475877',
      }),
      this.createTable({
        schema: 'public',
        table: 'discussionClassAssignment',
        columns: [
          col('assignedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('assignedById', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('classroomId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizPackageId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'discussionGrade',
        columns: [
          col('classroomId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('gradedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('gradedById', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('note', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('quizPackageId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('score', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'discussionClassAssignment',
        constraint: 'discussionClassAssignment_quizPackageId_classroomId_key',
        columns: ['quizPackageId', 'classroomId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'discussionGrade',
        constraint: 'discussionGrade_quizPackageId_studentId_key',
        columns: ['quizPackageId', 'studentId'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'quizCompletionRecord',
        constraint: 'quizCompletionRecord_sourceType_check_1cb1d6c9',
        expression: "\"sourceType\" IN ('MATERIAL_QUIZ', 'ASSIGNMENT', 'GROUP_TASK', 'DISCUSSION')",
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'quizPackage',
        constraint: 'quizPackage_assignmentMode_check_db3fbc66',
        expression: "\"assignmentMode\" IN ('INDIVIDUAL', 'GROUP', 'DISCUSSION')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'discussionClassAssignment',
        index: 'discussionClassAssignment_assignedById_idx_f5db02c3',
        columns: ['assignedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'discussionClassAssignment',
        index: 'discussionClassAssignment_classroomId_idx_e4a392d3',
        columns: ['classroomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'discussionClassAssignment',
        index: 'discussionClassAssignment_quizPackageId_idx_5e8f85e9',
        columns: ['quizPackageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'discussionGrade',
        index: 'discussionGrade_classroomId_idx_e4a392d3',
        columns: ['classroomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'discussionGrade',
        index: 'discussionGrade_gradedById_idx_1cf331f5',
        columns: ['gradedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'discussionGrade',
        index: 'discussionGrade_quizPackageId_classroomId_idx_cf9e9601',
        columns: ['quizPackageId', 'classroomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'discussionGrade',
        index: 'discussionGrade_quizPackageId_idx_5e8f85e9',
        columns: ['quizPackageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'discussionGrade',
        index: 'discussionGrade_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'discussionClassAssignment',
        foreignKey: {
          name: 'discussionClassAssignment_quizPackageId_fkey',
          columns: ['quizPackageId'],
          references: { schema: 'public', table: 'quizPackage', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'discussionClassAssignment',
        foreignKey: {
          name: 'discussionClassAssignment_classroomId_fkey',
          columns: ['classroomId'],
          references: { schema: 'public', table: 'classroom', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'discussionClassAssignment',
        foreignKey: {
          name: 'discussionClassAssignment_assignedById_fkey',
          columns: ['assignedById'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'discussionGrade',
        foreignKey: {
          name: 'discussionGrade_quizPackageId_fkey',
          columns: ['quizPackageId'],
          references: { schema: 'public', table: 'quizPackage', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'discussionGrade',
        foreignKey: {
          name: 'discussionGrade_classroomId_fkey',
          columns: ['classroomId'],
          references: { schema: 'public', table: 'classroom', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'discussionGrade',
        foreignKey: {
          name: 'discussionGrade_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'discussionGrade',
        foreignKey: {
          name: 'discussionGrade_gradedById_fkey',
          columns: ['gradedById'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
