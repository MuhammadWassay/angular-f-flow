import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  getOptions(): Promise<{ label: string; value: string }[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { label: 'File 1', value: 'file1.mp3' },
          { label: 'File 2', value: 'file2.mp3' },
          { label: 'File 3', value: 'file3.mp3' },
          { label: 'File 4', value: 'file4.mp3' },
          { label: 'File 5', value: 'file5.mp3' }
        ]);
      }, 300); 
    });
  }
}
