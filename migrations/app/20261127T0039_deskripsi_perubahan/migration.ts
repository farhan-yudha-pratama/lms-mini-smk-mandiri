#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/dc097beb17ef532aeac355b1e078bae77d3998f482ea42f6360ce92f6389c40f/contract';
import startContract from '../../snapshots/dc097beb17ef532aeac355b1e078bae77d3998f482ea42f6360ce92f6389c40f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/dc0e58031563af20c69318455ad9c5ae373a8a8a21b47662c02c689cd0e570b5/contract';
import endContract from '../../snapshots/dc0e58031563af20c69318455ad9c5ae373a8a8a21b47662c02c689cd0e570b5/contract.json' with { type: 'json' };
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
      this.createTable({
        schema: 'public',
        table: 'emailChangeVerification',
        columns: [
          col('attempts', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
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
          col('newEmail', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('otpHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('otpSalt', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('usedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
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
      this.createTable({
        schema: 'public',
        table: 'passwordResetToken',
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
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('usedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'permission',
        columns: [
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'permissionPackage',
        columns: [
          col('badge', 'text', {
            notNull: true,
            default: lit('Custom'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('category', 'text', {
            notNull: true,
            default: lit('Umum'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isSystem', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('permissions', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
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
      this.createTable({
        schema: 'public',
        table: 'userPermission',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('permissionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
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
        column: col('courseId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
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
        table: 'quizCompletionRecord',
        column: col('quizPackageId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
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
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('emailChangeCount', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('emailChangedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'classGroupMember',
        constraint: 'classGroupMember_groupId_studentId_key',
        columns: ['groupId', 'studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'courseTeacherClass',
        constraint: 'courseTeacherClass_courseId_teacherId_classroomId_key',
        columns: ['courseId', 'teacherId', 'classroomId'],
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
      this.addUnique({
        schema: 'public',
        table: 'materialCategory',
        constraint: 'materialCategory_courseId_orderIndex_key',
        columns: ['courseId', 'orderIndex'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'passwordResetToken',
        constraint: 'passwordResetToken_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'permission',
        constraint: 'permission_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'permissionPackage',
        constraint: 'permissionPackage_name_key',
        columns: ['name'],
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
      this.addUnique({
        schema: 'public',
        table: 'userPermission',
        constraint: 'userPermission_userId_permissionId_key',
        columns: ['userId', 'permissionId'],
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
      this.createIndex({
        schema: 'public',
        table: 'emailChangeVerification',
        index: 'emailChangeVerification_newEmail_idx_3482e746',
        columns: ['newEmail'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'emailChangeVerification',
        index: 'emailChangeVerification_userId_idx_a489d58a',
        columns: ['userId'],
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
        table: 'passwordResetToken',
        index: 'passwordResetToken_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizAttempt',
        index: 'quizAttempt_groupId_idx_e2fb5578',
        columns: ['groupId'],
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
      this.createIndex({
        schema: 'public',
        table: 'userPermission',
        index: 'userPermission_permissionId_idx_f46fcdf5',
        columns: ['permissionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userPermission',
        index: 'userPermission_userId_idx_a489d58a',
        columns: ['userId'],
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
      this.addForeignKey({
        schema: 'public',
        table: 'emailChangeVerification',
        foreignKey: {
          name: 'emailChangeVerification_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
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
      this.addForeignKey({
        schema: 'public',
        table: 'passwordResetToken',
        foreignKey: {
          name: 'passwordResetToken_userId_fkey',
          columns: ['userId'],
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
      this.addForeignKey({
        schema: 'public',
        table: 'userPermission',
        foreignKey: {
          name: 'userPermission_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userPermission',
        foreignKey: {
          name: 'userPermission_permissionId_fkey',
          columns: ['permissionId'],
          references: { schema: 'public', table: 'permission', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
