import {Component, OnInit} from '@angular/core';
import {Project} from "../../../models/project";
import {ProjectService} from "../../../services/project.service";
import {filter, map, Observable, of} from "rxjs";

@Component({
  selector: 'app-list-project',
  standalone: true,
  imports: [

  ],
  templateUrl: './list-project.component.html',
  styleUrl: './list-project.component.css'
})
export class ListProjectComponent implements OnInit{
  private PROJECTS: Project[] = [];

  constructor(private projectService: ProjectService) {
  }
  ngOnInit(): void {
    const observable = new Observable(subscriber => {
      subscriber.next('Первое значение');
      subscriber.next('Второе значение');
      setTimeout(() => {
        subscriber.next('Третье значение через 2 секунды');
        subscriber.complete();
      }, 2000);
    });
    observable.pipe(map(x=> x + ' добавленное значение!')).subscribe(x => console.log(x))
    observable.subscribe(x=> console.log(x));

    const observable1 = of(1,2,3)
    observable1.pipe(map(x => x*2)).subscribe(x => console.log(x));

    observable1.pipe(filter(x => x%2 ===0)).subscribe(x=> console.log(x));
  }



}
