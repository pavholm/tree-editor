import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TreeComponent } from './components/tree/tree.component';
import { EditorComponent } from './components/editor/editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AppComponent, TreeComponent, EditorComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelect,
    MatOption,
    MatIconModule,
    MatButtonModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
