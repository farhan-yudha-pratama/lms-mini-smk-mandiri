#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/a60c8c66f51c6585b344ffe46e95d287cd5860eb95501fada8e870eed62e55eb/contract';
import endContract from '../../snapshots/a60c8c66f51c6585b344ffe46e95d287cd5860eb95501fada8e870eed62e55eb/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ec4fbe85767f6a0b92da44c3c330f15dd7fb2d6c8ce37f024e8060950348fdc6/contract';
import startContract from '../../snapshots/ec4fbe85767f6a0b92da44c3c330f15dd7fb2d6c8ce37f024e8060950348fdc6/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'quizVariant',
        column: col('isActive', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
