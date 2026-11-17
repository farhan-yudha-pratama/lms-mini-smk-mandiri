#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/0daabda74b74436bb2a27408880f8b8d0c4e8011cd4817cdbe08435ccd3dd02c/contract';
import startContract from '../../snapshots/0daabda74b74436bb2a27408880f8b8d0c4e8011cd4817cdbe08435ccd3dd02c/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/4cfd2eba93a4df911b003cd20d31860acaff096894efc2e5f85af8cf1a1880fd/contract';
import endContract from '../../snapshots/4cfd2eba93a4df911b003cd20d31860acaff096894efc2e5f85af8cf1a1880fd/contract.json' with { type: 'json' };
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
      this.dropCheckConstraint({
        schema: 'public',
        table: 'quizCompletionRecord',
        constraint: 'quizCompletionRecord_sourceType_check_a8d38731',
      }),
      this.createTable({
        schema: 'public',
        table: 'classGroup',
        columns: [
          col('classroomId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('courseId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('createdByTeacherId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isShared', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizPackageId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizVariantId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('ruleMode', 'text', {
            notNull: true,
            default: lit('MANUAL'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('ruleValue', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('taskNote', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'classGroup_ruleMode_check_cd128122',
            "\"ruleMode\" IN ('RANDOM_COUNT', 'RANDOM_SIZE', 'MANUAL')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'classGroupMember',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('groupId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('scoreOverride', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizAttempt',
        column: col('groupId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizCompletionRecord',
        column: col('groupBaseScore', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizCompletionRecord',
        column: col('groupId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizCompletionRecord',
        column: col('groupMembersSummary', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizCompletionRecord',
        column: col('groupName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizCompletionRecord',
        column: col('groupVariantName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizPackage',
        column: col('assignmentMode', 'text', {
          notNull: true,
          default: lit('INDIVIDUAL'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'classGroupMember',
        constraint: 'classGroupMember_groupId_studentId_key',
        columns: ['groupId', 'studentId'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'quizCompletionRecord',
        constraint: 'quizCompletionRecord_sourceType_check_88db0880',
        expression: "\"sourceType\" IN ('MATERIAL_QUIZ', 'ASSIGNMENT', 'GROUP_TASK')",
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'quizPackage',
        constraint: 'quizPackage_assignmentMode_check_da475877',
        expression: "\"assignmentMode\" IN ('INDIVIDUAL', 'GROUP')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'classGroup',
        index: 'classGroup_classroomId_idx_e4a392d3',
        columns: ['classroomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'classGroup',
        index: 'classGroup_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'classGroup',
        index: 'classGroup_createdByTeacherId_idx_c32da81c',
        columns: ['createdByTeacherId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'classGroup',
        index: 'classGroup_quizPackageId_classroomId_idx_cf9e9601',
        columns: ['quizPackageId', 'classroomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'classGroup',
        index: 'classGroup_quizPackageId_idx_5e8f85e9',
        columns: ['quizPackageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'classGroup',
        index: 'classGroup_quizVariantId_idx_bb620c0b',
        columns: ['quizVariantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'classGroupMember',
        index: 'classGroupMember_groupId_idx_e2fb5578',
        columns: ['groupId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'classGroupMember',
        index: 'classGroupMember_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizAttempt',
        index: 'quizAttempt_groupId_idx_e2fb5578',
        columns: ['groupId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'classGroup',
        foreignKey: {
          name: 'classGroup_quizPackageId_fkey',
          columns: ['quizPackageId'],
          references: { schema: 'public', table: 'quizPackage', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'classGroup',
        foreignKey: {
          name: 'classGroup_classroomId_fkey',
          columns: ['classroomId'],
          references: { schema: 'public', table: 'classroom', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'classGroup',
        foreignKey: {
          name: 'classGroup_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'classGroup',
        foreignKey: {
          name: 'classGroup_createdByTeacherId_fkey',
          columns: ['createdByTeacherId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'classGroup',
        foreignKey: {
          name: 'classGroup_quizVariantId_fkey',
          columns: ['quizVariantId'],
          references: { schema: 'public', table: 'quizVariant', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'classGroupMember',
        foreignKey: {
          name: 'classGroupMember_groupId_fkey',
          columns: ['groupId'],
          references: { schema: 'public', table: 'classGroup', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'classGroupMember',
        foreignKey: {
          name: 'classGroupMember_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizAttempt',
        foreignKey: {
          name: 'quizAttempt_groupId_fkey',
          columns: ['groupId'],
          references: { schema: 'public', table: 'classGroup', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
