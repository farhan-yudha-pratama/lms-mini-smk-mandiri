#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/407b46c154bb38a02b8230257fa223d6d895beda3be9a303ea177563a37cfa0b/contract';
import endContract from '../../snapshots/407b46c154bb38a02b8230257fa223d6d895beda3be9a303ea177563a37cfa0b/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'auditLog',
        columns: [
          col('action', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('details', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('ipAddress', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'classroom',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('joinCode', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('maxStudents', 'int4', {
            notNull: true,
            default: lit(32),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'materialCategory',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('icon', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderIndex', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
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
        table: 'page',
        columns: [
          col('categoryId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isPublished', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('orderIndex', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'pageAccess',
        columns: [
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('pageId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('LOCKED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('unlockedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'pageAccess_status_check_1cd54683',
            "\"status\" IN ('LOCKED', 'UNLOCKED', 'COMPLETED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'pageSequence',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('minQuizScore', 'float8', {
            notNull: true,
            default: lit(70),
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('pageId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('prerequisitePageId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'pageSummary',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderIndex', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('pageId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'question',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderIndex', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('points', 'float8', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('questionText', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('questionType', 'text', {
            notNull: true,
            default: lit('PILIHAN_GANDA'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('quizVariantId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'question_questionType_check_f3e2dfbc',
            "\"questionType\" IN ('PILIHAN_GANDA', 'ESSAY')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'questionOption',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isCorrect', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('optionText', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderIndex', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('questionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'quizAssignment',
        columns: [
          col('assignedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizPackageId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizVariantId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'quizAttempt',
        columns: [
          col('finishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizVariantId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('score', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('startedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('IN_PROGRESS'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'quizAttempt_status_check_3b5a9657',
            "\"status\" IN ('IN_PROGRESS', 'COMPLETED', 'GRADED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'quizPackage',
        columns: [
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
          col('pageId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('passingScore', 'float8', {
            notNull: true,
            default: lit(70),
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('shuffleQuestions', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('timeLimit', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'quizVariant',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizPackageId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'session',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('ipAddress', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('refreshToken', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('userAgent', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'studentAnswer',
        columns: [
          col('essayAnswer', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isCorrect', 'bool', { codecRef: { codecId: 'pg/bool@1' } }),
          col('pointsEarned', 'float8', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('questionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizAttemptId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('selectedOptionId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('avatar', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('classId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('failedLoginAttempts', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('lockedUntil', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('MURID'),
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
            'user_role_check_75f5e88e',
            "\"role\" IN ('SUPERADMIN', 'GURU', 'MURID')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'classroom',
        constraint: 'classroom_joinCode_key',
        columns: ['joinCode'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'materialCategory',
        constraint: 'materialCategory_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'materialCategory',
        constraint: 'materialCategory_orderIndex_key',
        columns: ['orderIndex'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'page',
        constraint: 'page_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'page',
        constraint: 'page_categoryId_orderIndex_key',
        columns: ['categoryId', 'orderIndex'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'pageAccess',
        constraint: 'pageAccess_pageId_studentId_key',
        columns: ['pageId', 'studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'pageSequence',
        constraint: 'pageSequence_pageId_key',
        columns: ['pageId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'quizAssignment',
        constraint: 'quizAssignment_quizPackageId_studentId_key',
        columns: ['quizPackageId', 'studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'quizPackage',
        constraint: 'quizPackage_pageId_key',
        columns: ['pageId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'session',
        constraint: 'session_refreshToken_key',
        columns: ['refreshToken'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'auditLog',
        index: 'auditLog_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'page',
        index: 'page_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pageAccess',
        index: 'pageAccess_pageId_idx_8caaba4f',
        columns: ['pageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pageAccess',
        index: 'pageAccess_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pageSequence',
        index: 'pageSequence_prerequisitePageId_idx_2d7d1c32',
        columns: ['prerequisitePageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pageSummary',
        index: 'pageSummary_pageId_idx_8caaba4f',
        columns: ['pageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'question',
        index: 'question_quizVariantId_idx_bb620c0b',
        columns: ['quizVariantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'questionOption',
        index: 'questionOption_questionId_idx_fdb42076',
        columns: ['questionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizAssignment',
        index: 'quizAssignment_quizPackageId_idx_5e8f85e9',
        columns: ['quizPackageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizAssignment',
        index: 'quizAssignment_quizVariantId_idx_bb620c0b',
        columns: ['quizVariantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizAssignment',
        index: 'quizAssignment_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizAttempt',
        index: 'quizAttempt_quizVariantId_idx_bb620c0b',
        columns: ['quizVariantId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizAttempt',
        index: 'quizAttempt_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizVariant',
        index: 'quizVariant_quizPackageId_idx_5e8f85e9',
        columns: ['quizPackageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'session',
        index: 'session_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'studentAnswer',
        index: 'studentAnswer_questionId_idx_fdb42076',
        columns: ['questionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'studentAnswer',
        index: 'studentAnswer_quizAttemptId_idx_240e8e24',
        columns: ['quizAttemptId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'studentAnswer',
        index: 'studentAnswer_selectedOptionId_idx_945b4851',
        columns: ['selectedOptionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'user',
        index: 'user_classId_idx_0089e5e7',
        columns: ['classId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'auditLog',
        foreignKey: {
          name: 'auditLog_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'page',
        foreignKey: {
          name: 'page_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'materialCategory', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pageAccess',
        foreignKey: {
          name: 'pageAccess_pageId_fkey',
          columns: ['pageId'],
          references: { schema: 'public', table: 'page', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pageAccess',
        foreignKey: {
          name: 'pageAccess_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pageSequence',
        foreignKey: {
          name: 'pageSequence_pageId_fkey',
          columns: ['pageId'],
          references: { schema: 'public', table: 'page', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pageSequence',
        foreignKey: {
          name: 'pageSequence_prerequisitePageId_fkey',
          columns: ['prerequisitePageId'],
          references: { schema: 'public', table: 'page', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pageSummary',
        foreignKey: {
          name: 'pageSummary_pageId_fkey',
          columns: ['pageId'],
          references: { schema: 'public', table: 'page', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'question',
        foreignKey: {
          name: 'question_quizVariantId_fkey',
          columns: ['quizVariantId'],
          references: { schema: 'public', table: 'quizVariant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'questionOption',
        foreignKey: {
          name: 'questionOption_questionId_fkey',
          columns: ['questionId'],
          references: { schema: 'public', table: 'question', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizAssignment',
        foreignKey: {
          name: 'quizAssignment_quizPackageId_fkey',
          columns: ['quizPackageId'],
          references: { schema: 'public', table: 'quizPackage', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizAssignment',
        foreignKey: {
          name: 'quizAssignment_quizVariantId_fkey',
          columns: ['quizVariantId'],
          references: { schema: 'public', table: 'quizVariant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizAssignment',
        foreignKey: {
          name: 'quizAssignment_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizAttempt',
        foreignKey: {
          name: 'quizAttempt_quizVariantId_fkey',
          columns: ['quizVariantId'],
          references: { schema: 'public', table: 'quizVariant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizAttempt',
        foreignKey: {
          name: 'quizAttempt_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizPackage',
        foreignKey: {
          name: 'quizPackage_pageId_fkey',
          columns: ['pageId'],
          references: { schema: 'public', table: 'page', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizVariant',
        foreignKey: {
          name: 'quizVariant_quizPackageId_fkey',
          columns: ['quizPackageId'],
          references: { schema: 'public', table: 'quizPackage', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'session',
        foreignKey: {
          name: 'session_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'studentAnswer',
        foreignKey: {
          name: 'studentAnswer_quizAttemptId_fkey',
          columns: ['quizAttemptId'],
          references: { schema: 'public', table: 'quizAttempt', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'studentAnswer',
        foreignKey: {
          name: 'studentAnswer_questionId_fkey',
          columns: ['questionId'],
          references: { schema: 'public', table: 'question', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'studentAnswer',
        foreignKey: {
          name: 'studentAnswer_selectedOptionId_fkey',
          columns: ['selectedOptionId'],
          references: { schema: 'public', table: 'questionOption', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'user',
        foreignKey: {
          name: 'user_classId_fkey',
          columns: ['classId'],
          references: { schema: 'public', table: 'classroom', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
