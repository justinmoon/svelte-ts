import * as idb from "idb-keyval";

export async function set(key: string, value: number) {
    return idb.set(key, value)
}

export async function get(key: string) {
    const value = idb.get(key)
    return value || ""
}