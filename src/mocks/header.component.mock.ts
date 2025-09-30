import { Component } from '@angular/core';
import { HeaderComponent } from '@core/layout/header/header.component';

@Component({
  template: `
    <ui-header [title]="title"></ui-header>
  `,
  imports: [HeaderComponent]
})
export class HeaderComponentMock {
  title = 'Test Title';
}
