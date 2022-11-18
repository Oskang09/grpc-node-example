import * as dateFormat from "dateformat";

export function generateUNIQ(): string {
    const current = new Date();
    return dateFormat(current, "yyMMddHHmmssL") + getSuffix(4);
};
export function generateUNIQWithPrefix(prefix: string): string {
    const current = new Date();
    return prefix + dateFormat(current, "yyMMddHHmmssL") + getSuffix(4 - prefix.length);
};

function getSuffix(num: number) {
    const array: string[] = [];
    for (let i = 0; i < num; i++) {
        array.push(Math.floor(Math.random() * 10).toString());
    }
    return array.join("");
}