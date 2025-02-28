import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TreeService } from 'src/app/services/tree.service';
import { isFolderNode, Tree } from 'src/app/models/tree-item.model';

@Component({
  selector: 'editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class EditorComponent implements OnChanges {
  @Input() node: Tree | null = null;

  isFolderNode = isFolderNode;
  editGroup: UntypedFormGroup;

  constructor(private treeService: TreeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.node && changes['node']) {
      this.editGroup = new UntypedFormGroup({
        id: new UntypedFormControl(this.node.id),
        name: new UntypedFormControl(this.node.name, [Validators.required]),
        icon: new UntypedFormControl(this.node.icon),
      });
    }
  }

  saveForm() {
    this.treeService.editNode(
      this.editGroup.value.id,
      this.editGroup.value.name,
      this.editGroup.value.icon
    );
  }
}
