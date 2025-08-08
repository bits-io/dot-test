export class Syncronizeable {

    buildTimestampFields(payload: any, dto: { deletedAt?: string, updatedAt?: string }) {
        if (dto.updatedAt) {
            payload = { ...payload, updatedAt: dto.updatedAt };
        }

        if (dto.deletedAt) {
            payload = { ...payload, deletedAt: dto.deletedAt };
        }

        return payload;
    }
}