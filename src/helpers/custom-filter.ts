import { BadRequestException } from '@nestjs/common';

const filter = (strFilter?: string) => {
    if (!strFilter) {
        return null;
    }

    try {
        let objFilter = JSON.parse(strFilter);
        if (Array.isArray(objFilter)) {
            throw new BadRequestException("\"OR\" criteria filter is not allowed");
        }

        return objFilter;
    } catch (error) {
        let errMessage = "Failed to parse filters";
        if (error instanceof BadRequestException) {
            errMessage = error.message;
        }

        throw new BadRequestException(errMessage);
    }
}

const CustomFilter = {
    filter,
}

export default CustomFilter;