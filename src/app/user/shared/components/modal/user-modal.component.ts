import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-user-modal',
  template: `
    <ng-container>
      <div
        class="modal-backdrop-root"
        (click)="handleBackdropClick($event)"
      ></div>
      <div class="modal-wrapper" [attr.data-label]="modalLabel">
        <div [class]="containerClasses" [style]="containerStyles">
          <ng-content></ng-content>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['./user-modal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserModalComponent implements OnInit, OnChanges {
  containerClasses: string = 'modal-container';
  @Input() isOpen: boolean = false;
  @Input() fullscreen: boolean = false;
  @Input() containerStyles: string = '';
  @Input() fullWidth: boolean = true;
  @Input() maxWidth: 'lg' | 'md' | 'sm' | 'xl' | 'xs' = 'sm';
  @Input() modalLabel: string = '';

  @Output() onBackdropClick: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    if (this.fullscreen) {
      this.containerClasses += ' modal-container-fullscreen';
    }
    if (this.maxWidth) {
      this.containerClasses += ` modal-container-${this.maxWidth}`;
    }
    if (this.fullWidth) {
      this.containerClasses += ' modal-container-fullwidth';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isOpen && changes.isOpen.currentValue) {
      document.body.classList.add('modal-open');
    }
    if (changes.isOpen && !changes.isOpen.currentValue) {
      document.body.classList.remove('modal-open');
    }
  }

  handleBackdropClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.onClose.emit();
  }
}

@Component({
  selector: 'app-user-modal-header',
  template: `
    <ng-container
      *ngTemplateOutlet="
        headerTemplate ? headerTemplate : defaultHeaderTemplate
      "
    ></ng-container>
    <ng-template #defaultHeaderTemplate>
      <header class="modal-header-container row">
        <div class="col-auto">
          <a
            class="btn-modal-close"
            href="javascript:void()"
            (click)="handleActionClick($event, 'cancel')"
          >
            <i class="icon-back"></i>
          </a>
        </div>
        <div class="col">
          <div class="modal-title-wrapper">
            <span *ngIf="modalTitle" class="modal-title">
              {{ modalTitle }}
            </span>
            <span *ngIf="modalSubTitle" class="modal-subtitle">
              {{ modalSubTitle }}
            </span>
          </div>
        </div>
      </header>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class UserModalHeaderComponent {
  @Input() modalTitle: string = '';
  @Input() modalSubTitle: string = '';
  // @ts-ignore
  @Input() headerTemplate: TemplateRef<any>;

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  constructor() {}

  handleActionClick(e: Event, action: string) {
    e.preventDefault();
    e.stopPropagation();
    this.onClose.emit({ event: e, action: action });
  }
}

@Component({
  selector: 'app-user-modal-body',
  template: `
    <ng-container>
      <ng-content></ng-content>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class UserModalBodyComponent {
  constructor() {}
}

@Component({
  selector: 'app-user-modal-footer',
  template: `
    <ng-container
      *ngTemplateOutlet="
        footerTemplate ? footerTemplate : defaultFooterTemplate
      "
    ></ng-container>
    <ng-template #defaultFooterTemplate>
      <footer class="modal-footer-container" [attr.align]="align">
        <!-- <ng-content>

        </ng-content> -->
        <!-- <div class="row">
          <div class="col"> -->
            <button class="btn btn-outline-primary" (click)="handleActionClick($event, 'cancel')">{{closeBtnText}}</button>
            <button class="btn btn-primary ml-3" (click)="handleActionClick($event, 'ok')">{{okBtnText}}</button>
          <!-- </div>
        </div> -->
      </footer>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class UserModalFooterComponent {
  // @ts-ignore
  @Input() footerTemplate: TemplateRef<any>;
  @Input() align: any;
  @Input() closeBtnText: string = 'CLOSE';
  @Input() okBtnText: string = 'OK';
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  // @Output() onOK: EventEmitter<any> = new EventEmitter();
  constructor() {}

  handleActionClick(e: Event, action: string) {
    e.preventDefault();
    e.stopPropagation();
    this.onClose.emit({ event: e, action: action });
  }
}
