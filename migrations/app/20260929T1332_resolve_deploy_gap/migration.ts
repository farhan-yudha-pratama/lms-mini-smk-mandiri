#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/300643908e8b0d5a8758fa83adb133f00907274ec393f99951d8bff767913002/contract';
import endContract from '../../snapshots/300643908e8b0d5a8758fa83adb133f00907274ec393f99951d8bff767913002/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/407b46c154bb38a02b8230257fa223d6d895beda3be9a303ea177563a37cfa0b/contract';
import startContract from '../../snapshots/407b46c154bb38a02b8230257fa223d6d895beda3be9a303ea177563a37cfa0b/contract.json' with { type: 'json' };
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
        table: 'quizCompletionRecord',
        columns: [
          col('categoryName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('classroomId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('classroomName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('completedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('correctAnswers', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('essayCount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isPassed', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('pageSlug', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('pageTitle', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('passingScore', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('score', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('sourceId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sourceTitle', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sourceType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('studentEmail', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('studentName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('timeTakenSeconds', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('totalQuestions', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'quizCompletionRecord_sourceType_check_a8d38731',
            "\"sourceType\" IN ('MATERIAL_QUIZ', 'ASSIGNMENT')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'studentScoreSummary',
        columns: [
          col('averageAssignmentScore', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('averageMaterialQuizScore', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('classroomId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('classroomName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lastActivityAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('overallAverageScore', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('totalAssignmentCompleted', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('totalAssignmentPassed', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('totalMaterialCompleted', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('totalMaterialQuizCompleted', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('totalMaterialQuizPassed', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('totalPointsEarned', 'float8', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'studentScoreSummary',
        constraint: 'studentScoreSummary_studentId_key',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizCompletionRecord',
        index: 'quizCompletionRecord_classroomId_idx_e4a392d3',
        columns: ['classroomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizCompletionRecord',
        index: 'quizCompletionRecord_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'studentScoreSummary',
        index: 'studentScoreSummary_classroomId_idx_e4a392d3',
        columns: ['classroomId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizCompletionRecord',
        foreignKey: {
          name: 'quizCompletionRecord_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizCompletionRecord',
        foreignKey: {
          name: 'quizCompletionRecord_classroomId_fkey',
          columns: ['classroomId'],
          references: { schema: 'public', table: 'classroom', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'studentScoreSummary',
        foreignKey: {
          name: 'studentScoreSummary_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'studentScoreSummary',
        foreignKey: {
          name: 'studentScoreSummary_classroomId_fkey',
          columns: ['classroomId'],
          references: { schema: 'public', table: 'classroom', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
