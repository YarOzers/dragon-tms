import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Folder, FolderDTO} from "../models/folder";
import {environment} from "../environment";
import {TestCase} from "../models/test-case";

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getProjectFolders(projectId: number): Observable<Folder[]> {

    const folders = this.http.get<Folder[]>(`${this.apiUrl}/folders/${projectId}`);
    console.log(`Folders in getProjectFolders : ${folders}`);

    folders.subscribe()
    return folders;

  }

  addChildFolder(parentFolderId: number, folder: FolderDTO): Observable<Folder>{
    console.log("addChildFolder was executed")
    return this.http.post<Folder>(`${this.apiUrl}/folders/${parentFolderId}/child`,folder);
  }


}
