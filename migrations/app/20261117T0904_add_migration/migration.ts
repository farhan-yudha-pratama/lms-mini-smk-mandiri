#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/4cfd2eba93a4df911b003cd20d31860acaff096894efc2e5f85af8cf1a1880fd/contract';
import endContract from '../../snapshots/4cfd2eba93a4df911b003cd20d31860acaff096894efc2e5f85af8cf1a1880fd/contract.json' with { type: 'json' };
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
        table: 'materialCategory',
        constraint: 'materialCategory_courseId_orderIndex_key',
        columns: ['courseId', 'orderIndex'],
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
        constraint: 'quizCompletionRecord_sourceType_check_88db0880',
        expression: "\"sourceType\" IN ('MATERIAL_QUIZ', 'ASSIGNMENT', 'GROUP_TASK')",
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'quizPackage',
        constraint: 'quizPackage_assignmentMode_check_da475877',
        expression: "\"assignmentMode\" IN ('INDIVIDUAL', 'GROUP')",
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
        table: 'quizAttempt',
        index: 'quizAttempt_groupId_idx_e2fb5578',
        columns: ['groupId'],
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
