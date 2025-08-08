import PDFDocumentWithTables from "pdfkit-table";

export const cell = (doc: PDFDocumentWithTables, text: string, opt: { x: number, y: number, h: number, w: number, align?: 'center' | 'justify' | 'left' | 'right' }) => {
    doc.rect(opt.x, opt.y, opt.w, opt.h)
        .stroke()
        .text(text, opt.x + 4, opt.y + 4, { width: opt.w - 4, height: opt.h - 4, align: opt.align });
}

export const cellmulti = (doc: PDFDocumentWithTables, text: string, opt: { x: number, y: number, h: number, w: number, align?: 'center' | 'justify' | 'left' | 'right' }, extraline?: number) => {
    doc.rect(opt.x, opt.y, opt.w, opt.h)
        .stroke()
        .text(text, opt.x + 4, opt.y + 4 - extraline, { width: opt.w - 4, height: opt.h - 4, align: opt.align });
}
export function diff_day(first: any, second: any): any {
    if (first instanceof Date) {
    } else {
        first = new Date(first)
        second = new Date(second)
    }
    const diffInMs = second.getTime() - first.getTime();
    const diffInSeconds = diffInMs / 1000;
    const diffInMinutes = diffInSeconds / 60;
    let diff = Math.ceil(diffInMinutes) + ' Minutes'
    return diff;
}
export class NumberToWords {
    private static hyphen: string = '-';
    private static conjunction: string = ' and ';
    private static separator: string = ', ';
    private static negative: string = 'negative ';
    private static decimal: string = ' point ';
    private static dictionary: { [key: number]: string } = {
        0: 'zero',
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
        6: 'six',
        7: 'seven',
        8: 'eight',
        9: 'nine',
        10: 'ten',
        11: 'eleven',
        12: 'twelve',
        13: 'thirteen',
        14: 'fourteen',
        15: 'fifteen',
        16: 'sixteen',
        17: 'seventeen',
        18: 'eighteen',
        19: 'nineteen',
        20: 'twenty',
        30: 'thirty',
        40: 'forty',
        50: 'fifty',
        60: 'sixty',
        70: 'seventy',
        80: 'eighty',
        90: 'ninety',
        100: 'hundred',
        1000: 'thousand',
        1000000: 'million',
        1000000000: 'billion',
        1000000000000: 'trillion',
        1000000000000000: 'quadrillion',
        1000000000000000000: 'quintillion'
    };

    public static toEnglish(number: any | string): string | boolean {
        if (typeof number === 'string') {
            number = parseFloat(number);
        }

        if (!isFinite(number)) {
            return false;
        }

        if (number < -Number.MAX_SAFE_INTEGER || number > Number.MAX_SAFE_INTEGER) {
            console.warn(`toEnglish only accepts numbers between ${-Number.MAX_SAFE_INTEGER} and ${Number.MAX_SAFE_INTEGER}`);
            return false;
        }

        if (number < 0) {
            return this.negative + this.toEnglish(Math.abs(number));
        }

        let string: string = '';
        let fraction: string | undefined;

        if (number.toString().indexOf('.') !== -1) {
            [number, fraction] = number.toString().split('.');
        }

        switch (true) {
            case number < 21:
                string = this.dictionary[number];
                break;
            case number < 100:
                const tens = Math.floor(number / 10) * 10;
                const units = number % 10;
                string = this.dictionary[tens];
                if (units) {
                    string += this.hyphen + this.dictionary[units];
                }
                break;
            case number < 1000:
                const hundreds = Math.floor(number / 100);
                const remainder = number % 100;
                string = this.dictionary[hundreds] + ' ' + this.dictionary[100];
                if (remainder) {
                    string += this.conjunction + this.toEnglish(remainder);
                }
                break;
            default:
                const baseUnit = Math.pow(1000, Math.floor(Math.log(number) / Math.log(1000)));
                const numBaseUnits = Math.floor(number / baseUnit);
                const rem = number % baseUnit;
                string = this.toEnglish(numBaseUnits) + ' ' + this.dictionary[baseUnit];
                if (rem) {
                    string += rem < 100 ? this.conjunction : this.separator;
                    string += this.toEnglish(rem);
                }
                break;
        }

        if (fraction !== undefined && !isNaN(Number(fraction))) {
            string += this.decimal;
            const words = fraction.split('').map(digit => this.dictionary[parseInt(digit, 10)]);
            string += words.join(' ');
        }

        return this.capitalize(string);
    }

    private static capitalize(text: string): string {
        return text.replace(/\b\w/g, (char: string) => char.toUpperCase());
    }
}

export class NumberToKata {
    private static hyphen: string = ' ';
    private static conjunction: string = ' ';
    private static separator: string = ', ';
    private static negative: string = 'negatif ';
    private static decimal: string = ' koma ';
    private static dictionary: { [key: number]: string } = {
        0: 'nol',
        1: 'satu',
        2: 'dua',
        3: 'tiga',
        4: 'empat',
        5: 'lima',
        6: 'enam',
        7: 'tujuh',
        8: 'delapan',
        9: 'sembilan',
        10: 'sepuluh',
        11: 'sebelas',
        12: 'dua belas',
        13: 'tiga belas',
        14: 'empat belas',
        15: 'lima belas',
        16: 'enam belas',
        17: 'tujuh belas',
        18: 'delapan belas',
        19: 'sembilan belas',
        20: 'dua puluh',
        30: 'tiga puluh',
        40: 'empat puluh',
        50: 'lima puluh',
        60: 'enam puluh',
        70: 'tujuh puluh',
        80: 'delapan puluh',
        90: 'sembilan puluh',
        100: 'ratus',
        1000: 'ribu',
        1000000: 'juta',
        1000000000: 'miliar',
        1000000000000: 'triliun',
        1000000000000000: 'kuadriliun',
        1000000000000000000: 'kuintiliun'
    };

    public static toIndonesian(number: any | string): string | boolean {
        if (typeof number === 'string') {
            number = parseFloat(number);
        }

        if (!isFinite(number)) {
            return false;
        }

        if (number < -Number.MAX_SAFE_INTEGER || number > Number.MAX_SAFE_INTEGER) {
            console.warn(`toIndonesian hanya menerima angka antara ${-Number.MAX_SAFE_INTEGER} dan ${Number.MAX_SAFE_INTEGER}`);
            return false;
        }

        if (number < 0) {
            return this.negative + this.toIndonesian(Math.abs(number));
        }

        let string: string = '';
        let fraction: string | undefined;

        if (number.toString().indexOf('.') !== -1) {
            [number, fraction] = number.toString().split('.');
        }

        switch (true) {
            case number < 21:
                string = this.dictionary[number];
                break;
            case number < 100:
                const tens = Math.floor(number / 10) * 10;
                const units = number % 10;
                string = this.dictionary[tens];
                if (units) {
                    string += this.hyphen + this.dictionary[units];
                }
                break;
            case number < 1000:
                const hundreds = Math.floor(number / 100);
                const remainder = number % 100;
                if (hundreds === 1) {
                    string = 'seratus';
                } else {
                    string = this.dictionary[hundreds] + ' ' + this.dictionary[100];
                }
                if (remainder) {
                    string += this.conjunction + this.toIndonesian(remainder);
                }
                break;
            default:
                const baseUnit = Math.pow(1000, Math.floor(Math.log(number) / Math.log(1000)));
                const numBaseUnits = Math.floor(number / baseUnit);
                const rem = number % baseUnit;
                if (baseUnit === 1000 && numBaseUnits === 1) {
                    string = 'seribu';
                } else {
                    string = this.toIndonesian(numBaseUnits) + ' ' + this.dictionary[baseUnit];
                }
                if (rem) {
                    string += rem < 100 ? this.conjunction : this.separator;
                    string += this.toIndonesian(rem);
                }
                break;
        }

        if (fraction !== undefined && !isNaN(Number(fraction))) {
            string += this.decimal;
            const words = fraction.split('').map(digit => this.dictionary[parseInt(digit, 10)]);
            string += words.join(' ');
        }

        return this.kapitalisasiHurufPertama(string);
    }

    private static kapitalisasiHurufPertama(text: string): string {
        return text.replace(/\b\w/g, (char: string) => char.toUpperCase());
    }
}
// '999', 25, currentLine, { width: 40, align: 'center' }
export const texta4 = (doc: PDFDocumentWithTables, text: string, x: number, y: number, opt: { width?: number, align?: 'center' | 'justify' | 'left' | 'right' }) => {
    doc.text(text, x, y, { width: opt.width, align: opt.align })
}

export function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
