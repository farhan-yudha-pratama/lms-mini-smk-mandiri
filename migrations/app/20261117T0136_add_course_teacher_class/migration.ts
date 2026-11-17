#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0daabda74b74436bb2a27408880f8b8d0c4e8011cd4817cdbe08435ccd3dd02c/contract';
import endContract from '../../snapshots/0daabda74b74436bb2a27408880f8b8d0c4e8011cd4817cdbe08435ccd3dd02c/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d9d5f39f76b6093aaedc62232eb682aff37e1d75f01200d59ba644fdffc3147a/contract';
import startContract from '../../snapshots/d9d5f39f76b6093aaedc62232eb682aff37e1d75f01200d59ba644fdffc3147a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'courseTeacherClass',
        columns: [
          col('classroomId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('courseId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('teacherId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'courseTeacherClass',
        constraint: 'courseTeacherClass_courseId_teacherId_classroomId_key',
        columns: ['courseId', 'teacherId', 'classroomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'courseTeacherClass',
        index: 'courseTeacherClass_classroomId_idx_e4a392d3',
        columns: ['classroomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'courseTeacherClass',
        index: 'courseTeacherClass_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'courseTeacherClass',
        index: 'courseTeacherClass_courseId_teacherId_idx_53d44d4e',
        columns: ['courseId', 'teacherId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'courseTeacherClass',
        index: 'courseTeacherClass_teacherId_idx_bc266660',
        columns: ['teacherId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'courseTeacherClass',
        foreignKey: {
          name: 'courseTeacherClass_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'courseTeacherClass',
        foreignKey: {
          name: 'courseTeacherClass_teacherId_fkey',
          columns: ['teacherId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'courseTeacherClass',
        foreignKey: {
          name: 'courseTeacherClass_classroomId_fkey',
          columns: ['classroomId'],
          references: { schema: 'public', table: 'classroom', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
