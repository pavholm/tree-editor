import { Component } from '@angular/core';
import { TreeService } from 'src/app/services/tree.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  tree$ = this.treeService.tree$;
  selectedForEditingNode$ = this.treeService.selectedForEditingNode$;

  constructor(private treeService: TreeService) {}
}
