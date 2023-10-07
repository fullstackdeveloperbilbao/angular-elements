import {
  Component,
  EnvironmentInjector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { matTooltipComponentText } from '../constants/constants';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  NgElement,
  WithProperties,
  createCustomElement,
} from '@angular/elements';
import { DynamicPriceComponent } from './components/dynamic-price/dynamic-price.component';
import { BehaviorSubject, Subject, interval, noop, takeUntil, tap } from 'rxjs';
import { MatTooltipTemplateDirective } from '../directives/mat-tooltip-template.directive';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatTooltipTemplateDirective,
  ],
})
export class ProductComponent implements OnInit, OnDestroy {
  matTooltipComponentText = matTooltipComponentText;
  price = new BehaviorSubject<number>(20);

  private _destroyed = new Subject<void>();

  constructor(private injector: EnvironmentInjector) {
    this.defineCustomElement();
  }

  ngOnInit(): void {
    interval(1000)
      .pipe(
        tap(() => this.makeOffer()),
        takeUntil(this._destroyed)
      )
      .subscribe(noop);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private defineCustomElement() {
    const dynamicPriceElement = createCustomElement(DynamicPriceComponent, {
      injector: this.injector,
    });
    if (!customElements.get('dynamic-price-element')) {
      customElements.define('dynamic-price-element', dynamicPriceElement);
    }
  }

  createCustomElement() {
    const dynamicPriceEl: NgElement & WithProperties<DynamicPriceComponent> =
      document.createElement('dynamic-price-element') as any;

    dynamicPriceEl.dynamicPrice$ = this.price;
    return dynamicPriceEl;
  }

  private makeOffer() {
    const newPrice = this.price.value + this.generateRandomNumber(-10, 10);
    if (newPrice < 0) {
      this.price.next(this.generateRandomNumber(0, 10));
    }
    this.price.next(newPrice);
  }

  private generateRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
