import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';
import { ButtonComponent } from './button.component';

// Mock SafeHtmlPipe since we don't want to test the pipe itself
class MockSafeHtmlPipe {
  transform(value: string): string {
    return value;
  }
}

// Test host component to test button with content
@Component({
  imports: [
    ButtonComponent
  ],
  template: `
    <app-button
      [size]="size"
      [variant]="variant"
      [disabled]="disabled"
      [className]="className"
      [startIcon]="startIcon"
      [endIcon]="endIcon"
      (btnClick)="onButtonClick($event)">
      Button Text
    </app-button>
  `
})
class TestHostComponent {
  size: 'sm' | 'md' = 'md';
  variant: 'primary' | 'outline' = 'primary';
  disabled = false;
  className = '';
  startIcon?: string;
  endIcon?: string;
  clickCount = 0;

  onButtonClick(event: Event): void {
    this.clickCount++;
  }
}

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let buttonEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
      providers: [
        { provide: SafeHtmlPipe, useClass: MockSafeHtmlPipe }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    buttonEl = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input bindings', () => {
    it('should set default size to "md"', () => {
      expect(component.size).toBe('md');
    });

    it('should set default variant to "primary"', () => {
      expect(component.variant).toBe('primary');
    });

    it('should set default disabled to false', () => {
      expect(component.disabled).toBe(false);
    });

    it('should set default className to empty string', () => {
      expect(component.className).toBe('');
    });
  });

  describe('CSS classes generation', () => {
    it('should generate correct size classes for "md"', () => {
      component.size = 'md';
      fixture.detectChanges();
      expect(component.sizeClasses).toBe('px-5 py-3.5 text-sm');
    });

    it('should generate correct size classes for "sm"', () => {
      component.size = 'sm';
      fixture.detectChanges();
      expect(component.sizeClasses).toBe('px-4 py-3 text-sm');
    });

    it('should generate correct variant classes for "primary"', () => {
      component.variant = 'primary';
      fixture.detectChanges();
      expect(component.variantClasses).toContain('bg-brand-500');
      expect(component.variantClasses).toContain('text-white');
    });

    it('should generate correct variant classes for "outline"', () => {
      component.variant = 'outline';
      fixture.detectChanges();
      expect(component.variantClasses).toContain('bg-white');
      expect(component.variantClasses).toContain('text-gray-700');
    });

    it('should generate correct disabled classes when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(component.disabledClasses).toBe('cursor-not-allowed opacity-50');
    });

    it('should generate empty disabled classes when not disabled', () => {
      component.disabled = false;
      fixture.detectChanges();
      expect(component.disabledClasses).toBe('');
    });
  });

  describe('Button rendering', () => {
    it('should render button with correct base classes', () => {
      const button = buttonEl.nativeElement as HTMLButtonElement;
      expect(button.classList).toContain('inline-flex');
      expect(button.classList).toContain('items-center');
      expect(button.classList).toContain('justify-center');
      expect(button.classList).toContain('gap-2');
      expect(button.classList).toContain('rounded-lg');
      expect(button.classList).toContain('transition');
    });

    it('should apply custom className', () => {
      component.className = 'custom-class';
      fixture.detectChanges();

      const button = buttonEl.nativeElement as HTMLButtonElement;
      expect(button.classList).toContain('custom-class');
    });

    it('should not have disabled attribute when not disabled', () => {
      component.disabled = false;
      fixture.detectChanges();

      const button = buttonEl.nativeElement as HTMLButtonElement;
      expect(button.disabled).toBeFalse();
    });

    it('should have disabled attribute when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const button = buttonEl.nativeElement as HTMLButtonElement;
      expect(button.disabled).toBeTrue();
    });
  });

  describe('Icons rendering', () => {
    it('should not render startIcon when not provided', () => {
      component.startIcon = undefined;
      fixture.detectChanges();

      const startIconEl = fixture.debugElement.query(By.css('[innerHTML]'));
      expect(startIconEl).toBeNull();
    });

    it('should render startIcon when provided', () => {
      component.startIcon = '<svg>icon</svg>';
      fixture.detectChanges();

      const icons = fixture.debugElement.queryAll(By.css('[innerHTML]'));
      expect(icons.length).toBe(1);
      expect(icons[0].nativeElement.innerHTML).toBe('<svg>icon</svg>');
    });

    it('should render endIcon when provided', () => {
      component.endIcon = '<svg>end-icon</svg>';
      fixture.detectChanges();

      const icons = fixture.debugElement.queryAll(By.css('[innerHTML]'));
      expect(icons.length).toBe(1);
      expect(icons[0].nativeElement.innerHTML).toBe('<svg>end-icon</svg>');
    });

    it('should render both startIcon and endIcon when provided', () => {
      component.startIcon = '<svg>start</svg>';
      component.endIcon = '<svg>end</svg>';
      fixture.detectChanges();

      const icons = fixture.debugElement.queryAll(By.css('[innerHTML]'));
      expect(icons.length).toBe(2);
      expect(icons[0].nativeElement.innerHTML).toBe('<svg>start</svg>');
      expect(icons[1].nativeElement.innerHTML).toBe('<svg>end</svg>');
    });
  });

  describe('Click events', () => {
    it('should emit btnClick event when clicked and not disabled', () => {
      spyOn(component.btnClick, 'emit');
      component.disabled = false;
      fixture.detectChanges();

      buttonEl.triggerEventHandler('click', new MouseEvent('click'));

      expect(component.btnClick.emit).toHaveBeenCalled();
    });

    it('should not emit btnClick event when clicked and disabled', () => {
      spyOn(component.btnClick, 'emit');
      component.disabled = true;
      fixture.detectChanges();

      buttonEl.triggerEventHandler('click', new MouseEvent('click'));

      expect(component.btnClick.emit).not.toHaveBeenCalled();
    });
  });
});

describe('ButtonComponent with host', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let buttonEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, TestHostComponent],
      providers: [
        { provide: SafeHtmlPipe, useClass: MockSafeHtmlPipe }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    buttonEl = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should project content inside the button', () => {
    const button = buttonEl.nativeElement as HTMLButtonElement;
    expect(button.textContent).toContain('Button Text');
  });

  it('should handle click events from host component', () => {
    expect(hostComponent.clickCount).toBe(0);

    buttonEl.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(hostComponent.clickCount).toBe(1);
  });

  it('should not handle click events when disabled from host', () => {
    hostComponent.disabled = true;
    fixture.detectChanges();

    expect(hostComponent.clickCount).toBe(0);

    buttonEl.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(hostComponent.clickCount).toBe(0);
  });

  it('should update button when host inputs change', () => {
    hostComponent.size = 'sm';
    hostComponent.variant = 'outline';
    hostComponent.disabled = true;
    hostComponent.className = 'test-class';
    hostComponent.startIcon = '<svg>test</svg>';
    fixture.detectChanges();

    const button = buttonEl.nativeElement as HTMLButtonElement;

    expect(button.classList).toContain('px-4');
    expect(button.classList).toContain('py-3');
    expect(button.disabled).toBeTrue();
    expect(button.classList).toContain('test-class');

    const icons = fixture.debugElement.queryAll(By.css('[innerHTML]'));
    expect(icons[0].nativeElement.innerHTML).toBe('<svg>test</svg>');
  });
});
