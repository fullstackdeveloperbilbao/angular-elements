import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Subject, delay, fromEvent, noop, takeUntil, tap } from 'rxjs';

@Directive({
  selector: '[matToolipTemplate]',
  standalone: true,
})
export class MatTooltipTemplateDirective implements OnInit, OnDestroy {
  @Input() templateGenerator!: () => Node;

  private _destroyed = new Subject<void>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private matTooltip: MatTooltip
  ) {}

  ngOnInit(): void {
    this.listenToTooltipVisibility();
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private listenToTooltipVisibility() {
    fromEvent(this.el.nativeElement, 'mouseenter')
      .pipe(
        delay(0),
        tap(() => {
          this.addTemplate();
        }),
        takeUntil(this._destroyed)
      )
      .subscribe(noop);
  }

  private addTemplate() {
    const nodes =
      this.matTooltip._tooltipInstance?._tooltip.nativeElement.querySelectorAll(
        'div'
      );
    const mostDeep = nodes?.item(nodes.length - 1);
    if (!!mostDeep) {
      mostDeep.textContent = null;
      this.renderer.setStyle(mostDeep, 'max-width', 'unset');
      this.renderer.appendChild(mostDeep, this.templateGenerator());
    }
  }
}
