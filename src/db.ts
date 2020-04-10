import * as idb from "idb-keyval";

export async function set(key: string, value: number) {
    return idb.set(key, value)
}

export async function get(key: string): Promise<string> {
    const value: string | undefined = await idb.get(key)
    console.log("get", value)
    if (value === undefined) {
        return ""
    }
    return value 
}