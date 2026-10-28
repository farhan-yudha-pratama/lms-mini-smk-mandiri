#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/dc097beb17ef532aeac355b1e078bae77d3998f482ea42f6360ce92f6389c40f/contract';
import startContract from '../../snapshots/dc097beb17ef532aeac355b1e078bae77d3998f482ea42f6360ce92f6389c40f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ec4fbe85767f6a0b92da44c3c330f15dd7fb2d6c8ce37f024e8060950348fdc6/contract';
import endContract from '../../snapshots/ec4fbe85767f6a0b92da44c3c330f15dd7fb2d6c8ce37f024e8060950348fdc6/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

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
      this.addForeignKey({
        schema: 'public',
        table: 'studentAnswer',
        foreignKey: {
          name: 'studentAnswer_feedbackAuthorId_fkey',
          columns: ['feedbackAuthorId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
