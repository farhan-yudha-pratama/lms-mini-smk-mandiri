#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/300643908e8b0d5a8758fa83adb133f00907274ec393f99951d8bff767913002/contract';
import startContract from '../../snapshots/300643908e8b0d5a8758fa83adb133f00907274ec393f99951d8bff767913002/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/72fb11b56b0ced769e10b387309d743149d85e4a407d14e4df752fb92d58cfa5/contract';
import endContract from '../../snapshots/72fb11b56b0ced769e10b387309d743149d85e4a407d14e4df752fb92d58cfa5/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'course',
        columns: [
          col('coverImage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('joinCode', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'courseStudent',
        columns: [
          col('courseId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'courseTeacher',
        columns: [
          col('courseId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('teacherId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'quizAntiCheatConfig',
        columns: [
          col('enableFullscreen', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('preventCopyPaste', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('preventTabSwitch', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('quizVariantId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'materialCategory',
        column: col('courseId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'course',
        constraint: 'course_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'course',
        constraint: 'course_joinCode_key',
        columns: ['joinCode'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'courseStudent',
        constraint: 'courseStudent_courseId_studentId_key',
        columns: ['courseId', 'studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'courseTeacher',
        constraint: 'courseTeacher_courseId_teacherId_key',
        columns: ['courseId', 'teacherId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'quizAntiCheatConfig',
        constraint: 'quizAntiCheatConfig_quizVariantId_key',
        columns: ['quizVariantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'courseStudent',
        index: 'courseStudent_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'courseStudent',
        index: 'courseStudent_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'courseTeacher',
        index: 'courseTeacher_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'courseTeacher',
        index: 'courseTeacher_teacherId_idx_bc266660',
        columns: ['teacherId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'materialCategory',
        index: 'materialCategory_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'courseStudent',
        foreignKey: {
          name: 'courseStudent_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'course', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'courseStudent',
        foreignKey: {
          name: 'courseStudent_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'courseTeacher',
        foreignKey: {
          name: 'courseTeacher_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'course', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'courseTeacher',
        foreignKey: {
          name: 'courseTeacher_teacherId_fkey',
          columns: ['teacherId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'materialCategory',
        foreignKey: {
          name: 'materialCategory_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'course', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizAntiCheatConfig',
        foreignKey: {
          name: 'quizAntiCheatConfig_quizVariantId_fkey',
          columns: ['quizVariantId'],
          references: { schema: 'public', table: 'quizVariant', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
