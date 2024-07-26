import {TestCase} from "./test-case";

export interface Folder {
  id: number;
  name: string;
  parentFolderId?: number;
  folders?: Folder[];
  testCases?: TestCase[];
}
