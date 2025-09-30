import { Component } from '@angular/core';
import { CardComponent } from '@shared/ui/card/card.component';

@Component({
  template: `
    <card
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy">
      <p>Test content</p>
    </card>
  `,
  imports: [CardComponent]
})
export class CardComponentMock {
  ariaLabel?: string;
  ariaLabelledBy?: string;
}
