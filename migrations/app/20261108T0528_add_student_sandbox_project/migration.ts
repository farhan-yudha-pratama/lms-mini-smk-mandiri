#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/da7a0ca4c97175f1dd1037585b40df2264a59f5a3668bfd2edf4da4632779d27/contract';
import endContract from '../../snapshots/da7a0ca4c97175f1dd1037585b40df2264a59f5a3668bfd2edf4da4632779d27/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/dc097beb17ef532aeac355b1e078bae77d3998f482ea42f6360ce92f6389c40f/contract';
import startContract from '../../snapshots/dc097beb17ef532aeac355b1e078bae77d3998f482ea42f6360ce92f6389c40f/contract.json' with { type: 'json' };
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
      this.dropConstraint({
        schema: 'public',
        table: 'materialCategory',
        constraint: 'materialCategory_orderIndex_key',
      }),
      this.createTable({
        schema: 'public',
        table: 'studentProject',
        columns: [
          col('activeFile', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('courseId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('files', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pageId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', {
            notNull: true,
            default: lit('WEB'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'studentProject_type_check_6199f5f8',
            "\"type\" IN ('WEB', 'SQL', 'PHP', 'FULLSTACK')",
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizVariant',
        column: col('isActive', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'studentAnswer',
        column: col('feedbackAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'studentAnswer',
        column: col('feedbackAuthorId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'materialCategory',
        constraint: 'materialCategory_courseId_orderIndex_key',
        columns: ['courseId', 'orderIndex'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'studentAnswer',
        index: 'studentAnswer_feedbackAuthorId_idx_ab432da2',
        columns: ['feedbackAuthorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'studentProject',
        index: 'studentProject_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'studentProject',
        index: 'studentProject_pageId_idx_8caaba4f',
        columns: ['pageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'studentProject',
        index: 'studentProject_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'studentAnswer',
        foreignKey: {
          name: 'studentAnswer_feedbackAuthorId_fkey',
          columns: ['feedbackAuthorId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'studentProject',
        foreignKey: {
          name: 'studentProject_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'studentProject',
        foreignKey: {
          name: 'studentProject_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'course', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'studentProject',
        foreignKey: {
          name: 'studentProject_pageId_fkey',
          columns: ['pageId'],
          references: { schema: 'public', table: 'page', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
