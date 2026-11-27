#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4cfd2eba93a4df911b003cd20d31860acaff096894efc2e5f85af8cf1a1880fd/contract';
import startContract from '../../snapshots/4cfd2eba93a4df911b003cd20d31860acaff096894efc2e5f85af8cf1a1880fd/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9b1309dbbd1d06e7ce4a213f13380c9d0a9609af7de9b07dd3eaf4e2ee688dc6/contract';
import endContract from '../../snapshots/9b1309dbbd1d06e7ce4a213f13380c9d0a9609af7de9b07dd3eaf4e2ee688dc6/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
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
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
