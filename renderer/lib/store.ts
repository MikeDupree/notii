import fs from "fs";
import { v4 as uuidv4 } from "uuid";

/**
 * Update Store
 *
 * @params: data - The data to store
 * @example ```
 * updateStore({name: 'John Doe'});
 * ```
 * @returns: response
 * @example ```
 * {
 *   sucess: true,
 *   message: "Success"
 * }```
 */
export const updateStore = (
  authType: string,
  userId: string,
  data: Record<string, unknown>
): { sucess: boolean; message: string } => {
  let response = {
    sucess: true,
    message: "Store sucess",
  };
  const storeFilePath = `${userId}.session.json`;
  let store = readStore("session", userId);
  if (!store) {
    console.log("Initializing store!");
    store = {};
  }

  // Check if there is an existing entry for this session authType
  if (!store[authType]) {
    store[authType] = data;
  } 
  // Else we overwrite the existing data fields with the new data fields.
  else {
    console.log("Existing Auth Types", store);
    const matchingData = store[authType];
    store[authType] = {
      ...matchingData,
      ...data,
    };
  }

  fs.writeFile(storeFilePath, JSON.stringify(store), (err) => {
    if (err) {
      response = {
        sucess: false,
        message: err?.message,
      };
    } else {
      console.log("File written successfully\n");
    }
  });

  return response;
};

type DataStoreEntry = {
  id: "string";
  [key: string]: unknown;
};

interface DataStore {
  name: string;
  owner: string;
  data: DataStoreEntry[];
}

export const updateDataStore = (
  storeName: string,
  userId: string,
  data: Record<string, unknown>
): { success: boolean; message: string } => {
  let response = {
    success: true,
    message: "Store sucess",
  };

  let storeFilePath = `${userId}.${storeName}.json`;
  let skipChecks = false;
  let updated = false;

  if (!data.id) {
    data.id = uuidv4();
    skipChecks = true;
  }

  let store = readStore(storeName, userId);
  if (!store) {
    console.log("Initializing store!");
    store = {
      name: storeName,
      owner: userId,
      data: [data],
    };
    skipChecks = true;
  }

  if (!skipChecks) {
    let existingData = {};
    const matchingData = store.data.filter(
      (entry: DataStoreEntry) => entry.id === data.id
    );

    if (matchingData.length) {
      // There should only ever be one entry.
      // Grab it here.
      existingData = matchingData.pop();
      for (const [i, entry] of store.data) {
        if (entry.id === data.id) {
          store.data[i] = {
            ...existingData,
            ...data,
          };
          updated = true;
        }
      }
    }
  }

  // Append new data if skipping checks or if we did check for existing DataStoreEntry
  // and didn't find anything.
  if (skipChecks || (!skipChecks && updated)) {
    store.data.push(data);
  }

  fs.writeFile(storeFilePath, JSON.stringify(store), (err) => {
    if (err) {
      response = {
        success: false,
        message: err?.message,
      };
    } else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("store.json", "utf8"));
    }
  });

  return response;
};

export const readStore = (storeName: string, userId: string) => {
  let data = null;
  try {
    data = fs.readFileSync(`${userId}.${storeName}.json`, {
      encoding: "utf8",
      flag: "r",
    });
  } catch (e) {
    console.log("=!= Store Read Error =!=");
    console.log(e);
    console.log("=i= Store Read Error =i=");
    return;
  }
  return JSON.parse(data);
};

export default {
  get: readStore,
  update: updateStore,
};
