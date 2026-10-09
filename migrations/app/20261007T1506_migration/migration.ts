#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/72fb11b56b0ced769e10b387309d743149d85e4a407d14e4df752fb92d58cfa5/contract';
import startContract from '../../snapshots/72fb11b56b0ced769e10b387309d743149d85e4a407d14e4df752fb92d58cfa5/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/dc097beb17ef532aeac355b1e078bae77d3998f482ea42f6360ce92f6389c40f/contract';
import endContract from '../../snapshots/dc097beb17ef532aeac355b1e078bae77d3998f482ea42f6360ce92f6389c40f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'question',
        constraint: 'question_questionType_check_f3e2dfbc',
      }),
      this.addColumn({
        schema: 'public',
        table: 'question',
        column: col('codeLanguage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'question',
        column: col('initialCode', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'question',
        column: col('testCases', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizPackage',
        column: col('closeAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizPackage',
        column: col('courseId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizPackage',
        column: col('isHidden', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'quizPackage',
        column: col('openAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'studentAnswer',
        column: col('essayFeedback', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dropNotNull({ schema: 'public', table: 'quizPackage', column: 'pageId' }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'question',
        constraint: 'question_questionType_check_0f8a5e2f',
        expression: "\"questionType\" IN ('PILIHAN_GANDA', 'ESSAY', 'CODE_CHALLENGE')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizPackage',
        index: 'quizPackage_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizPackage',
        foreignKey: {
          name: 'quizPackage_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'course', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
