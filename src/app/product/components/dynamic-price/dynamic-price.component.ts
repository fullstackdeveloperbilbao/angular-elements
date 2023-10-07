import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Observable, finalize, noop, tap } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './dynamic-price.component.html',
  styleUrls: ['./dynamic-price.component.scss'],
  imports: [CommonModule],
})
export class DynamicPriceComponent implements OnInit, OnDestroy {
  @Input() dynamicPrice$!: Observable<number>;

  ngOnInit(): void {
    console.log('DYNAMIC PRICE ONINIT');
  }

  ngOnDestroy(): void {
    console.log('DYNAMIC PRICE ONDESTROY');
  }
}
