import { prisma } from './prisma';
import { DataStore, StoreResult, StoredRecord } from './inMemoryStore';
import { EntitySchema } from '../config/schema';

export class PrismaStore implements DataStore {
  /**
   * Helper to parse the content JSON and inject system fields.
   */
  private mapToStoredRecord(item: any): StoredRecord {
    const content = JSON.parse(item.content);
    return {
      ...content,
      id: item.id.toString(),
      _ownerId: item.userId.toString(),
      // Mocking timestamps since they aren't in the provided schema
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async create(entity: EntitySchema, data: Record<string, unknown>): Promise<StoreResult<StoredRecord>> {
    try {
      const userId = parseInt((data._ownerId as string) ?? '0', 10);
      
      // Remove system fields before storing in 'content'
      const { _ownerId, ...rest } = data;
      
      const record = await prisma.data.create({
        data: {
          entity: entity.name,
          content: JSON.stringify(rest),
          userId: userId,
        },
      });

      return { ok: true, data: this.mapToStoredRecord(record) };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async findAll(entity: EntitySchema): Promise<StoreResult<StoredRecord[]>> {
    try {
      const records = await prisma.data.findMany({
        where: { entity: entity.name },
      });
      return { ok: true, data: records.map(r => this.mapToStoredRecord(r)) };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async findById(entity: EntitySchema, id: string): Promise<StoreResult<StoredRecord>> {
    try {
      const record = await prisma.data.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!record || record.entity !== entity.name) {
        return { ok: false, error: `${entity.name} with id "${id}" not found.` };
      }
      return { ok: true, data: this.mapToStoredRecord(record) };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async update(entity: EntitySchema, id: string, data: Record<string, unknown>): Promise<StoreResult<StoredRecord>> {
    try {
      const { _ownerId, ...rest } = data;
      const record = await prisma.data.update({
        where: { id: parseInt(id, 10) },
        data: {
          content: JSON.stringify(rest),
        },
      });
      return { ok: true, data: this.mapToStoredRecord(record) };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async remove(entity: EntitySchema, id: string): Promise<StoreResult<{ id: string }>> {
    try {
      await prisma.data.delete({
        where: { id: parseInt(id, 10) },
      });
      return { ok: true, data: { id } };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}
