import * as moment from "moment";
import { ValueTransformer } from "typeorm";

export class DateTimeTransformer implements ValueTransformer {
    to(date: string) {
        if (!date) {
            return undefined;
        }

        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }

    from(date: string) {
        return this.to(date);
    }
}