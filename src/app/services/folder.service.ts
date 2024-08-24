import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
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

  moveFolder(folderId: number, targetFolderId: number): Observable<Folder>{
    let params: HttpParams = new HttpParams()
      .set('folderId', folderId)
      .set('targetFolderId',targetFolderId);
    console.log(params);
    return this.http.put<Folder>(`${this.apiUrl}/folders/move`, null,{params: params})
  }

  copyFolder(folderId: number, targetFolderId: number):Observable<Folder>{
    let params : HttpParams = new HttpParams()
      .set('folderId', folderId)
      .set('targetFolderId', targetFolderId);
    return this.http.post<Folder>(`${this.apiUrl}/folders/copy`,null, {params:params})
  }


}
