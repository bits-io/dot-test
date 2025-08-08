import { IsNotEmpty } from "class-validator";

export default class InvoiceToken {

    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    id: number;
    
}