#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/dc0e58031563af20c69318455ad9c5ae373a8a8a21b47662c02c689cd0e570b5/contract';
import endContract from '../../snapshots/dc0e58031563af20c69318455ad9c5ae373a8a8a21b47662c02c689cd0e570b5/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f54d2b9a53c769b2517be61754b0fa0b17a8c597fc1a9f811c07376a29036cef/contract';
import startContract from '../../snapshots/f54d2b9a53c769b2517be61754b0fa0b17a8c597fc1a9f811c07376a29036cef/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'gradebookClassConfig',
        columns: [
          col('classroomId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('courseId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mode', 'text', {
            notNull: true,
            default: lit('ALL'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('updatedById', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'gradebookClassConfig_mode_check_c8c124a8',
            "\"mode\" IN ('ALL', 'CUSTOM')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        columns: [
          col('classroomId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('configId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('courseId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizPackageId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizCompletionRecord',
        column: col('courseId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizCompletionRecord',
        column: col('quizPackageId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'gradebookClassConfig',
        constraint: 'gradebookClassConfig_classroomId_courseId_key',
        columns: ['classroomId', 'courseId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        constraint: 'gradebookSelectedQuiz_configId_quizPackageId_key',
        columns: ['configId', 'quizPackageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gradebookClassConfig',
        index: 'gradebookClassConfig_classroomId_idx_e4a392d3',
        columns: ['classroomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gradebookClassConfig',
        index: 'gradebookClassConfig_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gradebookClassConfig',
        index: 'gradebookClassConfig_updatedById_idx_d0517c24',
        columns: ['updatedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        index: 'gradebookSelectedQuiz_classroomId_courseId_idx_420419d7',
        columns: ['classroomId', 'courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        index: 'gradebookSelectedQuiz_classroomId_idx_e4a392d3',
        columns: ['classroomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        index: 'gradebookSelectedQuiz_configId_idx_4b01acb6',
        columns: ['configId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        index: 'gradebookSelectedQuiz_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        index: 'gradebookSelectedQuiz_quizPackageId_idx_5e8f85e9',
        columns: ['quizPackageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizCompletionRecord',
        index: 'quizCompletionRecord_classroomId_courseId_idx_420419d7',
        columns: ['classroomId', 'courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizCompletionRecord',
        index: 'quizCompletionRecord_quizPackageId_idx_5e8f85e9',
        columns: ['quizPackageId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gradebookClassConfig',
        foreignKey: {
          name: 'gradebookClassConfig_classroomId_fkey',
          columns: ['classroomId'],
          references: { schema: 'public', table: 'classroom', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gradebookClassConfig',
        foreignKey: {
          name: 'gradebookClassConfig_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gradebookClassConfig',
        foreignKey: {
          name: 'gradebookClassConfig_updatedById_fkey',
          columns: ['updatedById'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        foreignKey: {
          name: 'gradebookSelectedQuiz_configId_fkey',
          columns: ['configId'],
          references: { schema: 'public', table: 'gradebookClassConfig', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        foreignKey: {
          name: 'gradebookSelectedQuiz_classroomId_fkey',
          columns: ['classroomId'],
          references: { schema: 'public', table: 'classroom', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        foreignKey: {
          name: 'gradebookSelectedQuiz_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gradebookSelectedQuiz',
        foreignKey: {
          name: 'gradebookSelectedQuiz_quizPackageId_fkey',
          columns: ['quizPackageId'],
          references: { schema: 'public', table: 'quizPackage', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
