import { BadRequestException } from '@nestjs/common';
import { where } from 'typeorm-where';

const filter = <T>(strFilter?: string, options?: { branchId?: number }) => {
    if (!strFilter) {
        return null;
    }

    try {
        let objFilter = JSON.parse(strFilter);
        if (Array.isArray(objFilter)) {
            throw new BadRequestException("\"OR\" criteria filter is not allowed");
        }

        if (options?.branchId) {
            objFilter = {
                ...objFilter,
                branch: { id: { $equal: options?.branchId } }
            }
        }

        return where<T>(objFilter);
    } catch (error) {
        let errMessage = "Failed to parse filters";
        if (error instanceof BadRequestException) {
            errMessage = error.message;
        }

        throw new BadRequestException(errMessage);
    }
}

const AdvanceFilter = {
    filter,
}

export default AdvanceFilter;