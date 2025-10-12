import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { IBuilderValueControlViewModel } from '../../domain/i-builder-value-control-view-model';

@Component({
    selector: 'textbox-control',
    templateUrl: './textbox-control.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ]
})
export class TextboxControlComponent {
    @Input({ required: true })
    public viewModel!: IBuilderValueControlViewModel;
}
