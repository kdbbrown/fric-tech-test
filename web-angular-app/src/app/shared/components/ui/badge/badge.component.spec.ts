import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';
import { BadgeComponent } from './badge.component';
import { CommonModule } from '@angular/common';

// Mock SafeHtmlPipe
class MockSafeHtmlPipe {
  transform(value: string): string {
    return value;
  }
}

// Test host component
@Component({
  imports: [
    BadgeComponent
  ],
  template: `
    <app-badge
      [variant]="variant"
      [size]="size"
      [color]="color"
      [startIcon]="startIcon"
      [endIcon]="endIcon">
      Badge Content
    </app-badge>
  `
})
class TestHostComponent {
  variant: 'light' | 'solid' = 'light';
  size: 'sm' | 'md' = 'md';
  color: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark' = 'primary';
  startIcon?: string;
  endIcon?: string;
}

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;
  let badgeEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, BadgeComponent],
      providers: [
        { provide: SafeHtmlPipe, useClass: MockSafeHtmlPipe }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    badgeEl = fixture.debugElement.query(By.css('span'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input defaults', () => {
    it('should have default variant "light"', () => {
      expect(component.variant).toBe('light');
    });

    it('should have default size "md"', () => {
      expect(component.size).toBe('md');
    });

    it('should have default color "primary"', () => {
      expect(component.color).toBe('primary');
    });
  });

  describe('Host binding', () => {
    it('should have "flex" class on host element', () => {
      const hostElement = fixture.debugElement.nativeElement;
      expect(hostElement.classList).toContain('flex');
    });
  });

  describe('Base styles', () => {
    it('should return correct base styles', () => {
      expect(component.baseStyles).toBe('inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium');
    });
  });

  describe('Size classes', () => {
    it('should return "text-sm" for md size', () => {
      component.size = 'md';
      expect(component.sizeClass).toBe('text-sm');
    });

    it('should return "text-theme-xs" for sm size', () => {
      component.size = 'sm';
      expect(component.sizeClass).toBe('text-theme-xs');
    });
  });

  describe('Color styles', () => {
    describe('Light variant', () => {
      beforeEach(() => {
        component.variant = 'light';
      });

      it('should return correct styles for primary color', () => {
        component.color = 'primary';
        expect(component.colorStyles).toContain('bg-brand-50');
        expect(component.colorStyles).toContain('text-brand-500');
      });

      it('should return correct styles for success color', () => {
        component.color = 'success';
        expect(component.colorStyles).toContain('bg-success-50');
        expect(component.colorStyles).toContain('text-success-600');
      });

      it('should return correct styles for error color', () => {
        component.color = 'error';
        expect(component.colorStyles).toContain('bg-error-50');
        expect(component.colorStyles).toContain('text-error-600');
      });

      it('should return correct styles for warning color', () => {
        component.color = 'warning';
        expect(component.colorStyles).toContain('bg-warning-50');
        expect(component.colorStyles).toContain('text-warning-600');
      });

      it('should return correct styles for info color', () => {
        component.color = 'info';
        expect(component.colorStyles).toContain('bg-blue-light-50');
        expect(component.colorStyles).toContain('text-blue-light-500');
      });

      it('should return correct styles for light color', () => {
        component.color = 'light';
        expect(component.colorStyles).toContain('bg-gray-100');
        expect(component.colorStyles).toContain('text-gray-700');
      });

      it('should return correct styles for dark color', () => {
        component.color = 'dark';
        expect(component.colorStyles).toContain('bg-gray-500');
        expect(component.colorStyles).toContain('text-white');
      });
    });

    describe('Solid variant', () => {
      beforeEach(() => {
        component.variant = 'solid';
      });

      it('should return correct styles for primary color', () => {
        component.color = 'primary';
        expect(component.colorStyles).toContain('bg-brand-500');
        expect(component.colorStyles).toContain('text-white');
      });

      it('should return correct styles for success color', () => {
        component.color = 'success';
        expect(component.colorStyles).toContain('bg-success-500');
        expect(component.colorStyles).toContain('text-white');
      });

      it('should return correct styles for error color', () => {
        component.color = 'error';
        expect(component.colorStyles).toContain('bg-error-500');
        expect(component.colorStyles).toContain('text-white');
      });

      it('should return correct styles for warning color', () => {
        component.color = 'warning';
        expect(component.colorStyles).toContain('bg-warning-500');
        expect(component.colorStyles).toContain('text-white');
      });

      it('should return correct styles for info color', () => {
        component.color = 'info';
        expect(component.colorStyles).toContain('bg-blue-light-500');
        expect(component.colorStyles).toContain('text-white');
      });

      it('should return correct styles for light color', () => {
        component.color = 'light';
        expect(component.colorStyles).toContain('bg-gray-400');
        expect(component.colorStyles).toContain('text-white');
      });

      it('should return correct styles for dark color', () => {
        component.color = 'dark';
        expect(component.colorStyles).toContain('bg-gray-700');
        expect(component.colorStyles).toContain('text-white');
      });
    });
  });

  describe('Rendering', () => {
    it('should render with base classes', () => {
      const span = badgeEl.nativeElement as HTMLSpanElement;
      expect(span.classList).toContain('inline-flex');
      expect(span.classList).toContain('items-center');
      expect(span.classList).toContain('px-2.5');
      expect(span.classList).toContain('py-0.5');
      expect(span.classList).toContain('justify-center');
      expect(span.classList).toContain('gap-1');
      expect(span.classList).toContain('rounded-full');
      expect(span.classList).toContain('font-medium');
    });

    it('should render with size class', () => {
      component.size = 'md';
      fixture.detectChanges();

      const span = badgeEl.nativeElement as HTMLSpanElement;
      expect(span.classList).toContain('text-sm');
    });

    it('should render with color styles', () => {
      component.variant = 'light';
      component.color = 'primary';
      fixture.detectChanges();

      const span = badgeEl.nativeElement as HTMLSpanElement;
      expect(span.classList).toContain('bg-brand-50');
      expect(span.classList).toContain('text-brand-500');
    });

    it('should not render icons when not provided', () => {
      component.startIcon = undefined;
      component.endIcon = undefined;
      fixture.detectChanges();

      const icons = badgeEl.queryAll(By.css('[innerHTML]'));
      expect(icons.length).toBe(0);
    });

    it('should render start icon when provided', () => {
      component.startIcon = '<svg>start</svg>';
      fixture.detectChanges();

      const icons = badgeEl.queryAll(By.css('[innerHTML]'));
      expect(icons.length).toBe(1);
      expect(icons[0].nativeElement.innerHTML).toBe('<svg>start</svg>');
      expect(icons[0].nativeElement.classList).toContain('mr-1');
    });

    it('should render end icon when provided', () => {
      component.endIcon = '<svg>end</svg>';
      fixture.detectChanges();

      const icons = badgeEl.queryAll(By.css('[innerHTML]'));
      expect(icons.length).toBe(1);
      expect(icons[0].nativeElement.innerHTML).toBe('<svg>end</svg>');
      expect(icons[0].nativeElement.classList).toContain('ml-1');
    });

    it('should render both icons when provided', () => {
      component.startIcon = '<svg>start</svg>';
      component.endIcon = '<svg>end</svg>';
      fixture.detectChanges();

      const icons = badgeEl.queryAll(By.css('[innerHTML]'));
      expect(icons.length).toBe(2);
      expect(icons[0].nativeElement.innerHTML).toBe('<svg>start</svg>');
      expect(icons[1].nativeElement.innerHTML).toBe('<svg>end</svg>');
    });
  });
});

describe('BadgeComponent with host', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let badgeEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, BadgeComponent, TestHostComponent],
      providers: [
        { provide: SafeHtmlPipe, useClass: MockSafeHtmlPipe }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    badgeEl = fixture.debugElement.query(By.css('span'));
    fixture.detectChanges();
  });

  it('should project content inside the badge', () => {
    const span = badgeEl.nativeElement as HTMLSpanElement;
    expect(span.textContent).toContain('Badge Content');
  });

  it('should update when host inputs change', () => {
    hostComponent.variant = 'solid';
    hostComponent.size = 'sm';
    hostComponent.color = 'success';
    hostComponent.startIcon = '<svg>test</svg>';
    fixture.detectChanges();

    const span = badgeEl.nativeElement as HTMLSpanElement;

    expect(span.classList).toContain('text-theme-xs');
    expect(span.classList).toContain('bg-success-500');
    expect(span.classList).toContain('text-white');

    const icons = badgeEl.queryAll(By.css('[innerHTML]'));
    expect(icons[0].nativeElement.innerHTML).toBe('<svg>test</svg>');
  });
});
