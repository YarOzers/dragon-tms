import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Folder} from "../models/folder";
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


}
