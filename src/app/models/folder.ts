import {TestCase} from "./test-case";

export interface Folder {
  id: number;
  name: string;
  parentFolderId?: number;
  folders?: Folder[];
  testCases: TestCase[];
  expanded?: boolean;
  type: 'folder';
  selected? : boolean | null;
}
export interface FolderDTO {
  name: string;
  projectId: number | null;
  parentFolderId?: number;
  folders?: Folder[];
  testCases?: TestCase[];
  expanded?: boolean;
  type?: number;
  selected? : boolean | null;
}

