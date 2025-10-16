import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
// import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IBuilderValueControlViewModel } from '../../domain/i-builder-value-control-view-model';

@Component({
  selector: 'outputs-select-control',
  templateUrl: './select-control.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatFormField,
    HttpClientModule,
    ReactiveFormsModule,
    MatOption,
    MatSelect
  ]
})
export class SelectControlComponent implements OnInit {

  @Input({ required: true })
  public viewModel!: IBuilderValueControlViewModel;

  protected options: {
    key: number;
    name: string;
    file: string;
  }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load JSON dynamicallyss
    this.http.get<{ key: number; name: string; file: string }[]>('assets/audio-files.json')
      .subscribe((data) => {
        this.options = data;
      });
  }
}
