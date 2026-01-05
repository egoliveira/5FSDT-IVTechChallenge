export function isStringFilterValid(value: string | undefined, minLength: number): boolean {
    const fixedValue = (value || "").trim();

    return (fixedValue.length == 0) || (fixedValue.length >= minLength);
}