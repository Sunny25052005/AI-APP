import { DataStore, StoreResult, StoredRecord } from './inMemoryStore';
import { EntitySchema } from '../config/schema';
export declare class JsonFileStore implements DataStore {
    private filePath;
    private memoryCache;
    constructor(filename?: string);
    /** Read the file from disk or initialize if missing */
    private loadFromDisk;
    /** Write the memory cache back to disk */
    private saveToDisk;
    private collection;
    private sanitize;
    create(entity: EntitySchema, data: Record<string, unknown>): StoreResult<StoredRecord>;
    findAll(entity: EntitySchema): StoreResult<StoredRecord[]>;
    findById(entity: EntitySchema, id: string): StoreResult<StoredRecord>;
    update(entity: EntitySchema, id: string, data: Record<string, unknown>): StoreResult<StoredRecord>;
    remove(entity: EntitySchema, id: string): StoreResult<{
        id: string;
    }>;
}
//# sourceMappingURL=jsonFileStore.d.ts.map