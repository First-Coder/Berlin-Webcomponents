import {html, TemplateResult} from "lit";
// Ensure components are registered when templates are used
import './BlnButton';
import './BlnSelect';
import './BlnCheckBox';
import './BlnTreeView';
import './ModernTree';
import './BlnToast';
import type { BlnSelectProps } from './BlnSelect';
import type { BlnCheckBoxProps } from './BlnCheckBox';
import type { BlnTreePropsType, BlnTreeNodeType } from './BlnTreeView';
import type { IDataModel } from './ModernTree';
import type { BlnToastProps } from './BlnToast';
import type { BlnButtonProps } from './BlnButton';

// A small, framework-agnostic builder that produces lit TemplateResults for our inputs/buttons
// and offers a simple validate API. Tests focus on validate().

export type FieldType = 'email' | 'password' | 'number' | 'text';

type SyncValidator = (value: string) => string;

type AsyncValidator = (value: string) => Promise<string>;

export default class FormBuilder {
  private fields: TemplateResult[] = [];

  private validateFunctions: Map<string, SyncValidator> = new Map();
  private asyncValidateFunctions: Map<string, AsyncValidator> = new Map();

  constructor() {
    // default validators
    this.validateFunctions.set('email', (value: string) => {
      return !value.includes('@') ? 'Falsches Email Format' : '';
    });
    // Passwort: mindestens 5 Zeichen
    this.validateFunctions.set('password', (value: string) => {
      return value && value.length >= 5 ? '' : 'Passwort zu kurz (mindestens 5 Zeichen)';
    });
    // Number: zwischen 10 und 99 (inklusive)
    this.validateFunctions.set('number', (value: string) => {
      const n = Number(value);
      if (Number.isNaN(n)) return 'Wert ist keine Zahl';
      if (n < 10) return 'Wert zu niedrig (mindestens 10)';
      if (n > 99) return 'Wert zu hoch (maximal 99)';
      return '';
    });
  }

  // Register/override a sync validator
  setCustomValidateFunction(type: string, func: SyncValidator) {
    this.validateFunctions.set(type, func);
    return this;
  }

  // Register/override an async validator
  setCustomValidateFunctionAsync(type: string, func: AsyncValidator) {
    this.asyncValidateFunctions.set(type, func);
    return this;
  }

  // Synchronous validation API
  validate(type: string, value: string) {
    const func = this.validateFunctions.get(type);
    return func ? func(value) : '';
  }

  // Asynchronous validation API
  async validateAsync(type: string, value: string): Promise<string> {
    const asyncFunc = this.asyncValidateFunctions.get(type);
    if (asyncFunc) {
      try {
        return await asyncFunc(value);
      } catch (e) {
        return typeof e === 'string' ? e : 'Validierung fehlgeschlagen';
      }
    }
    return Promise.resolve(this.validate(type, value));
  }

  // Builder: add different field types. These are minimal and not used by tests, but kept for completeness.
  addField(type: FieldType, label: string, value = '') {
    let field: TemplateResult;
    switch (type) {
      case 'email':
        field = html`
          <div class="form-group">
            <label>${label}</label>
            <input type="email" value=${value} />
            <small class="form-text">${this.validate('email', value)}</small>
          </div>`;
        break;
      case 'password':
        field = html`
          <div class="form-group">
            <label>${label}</label>
            <input type="password" value=${value} />
          </div>`;
        break;
      case 'number':
        field = html`
          <div class="form-group">
            <label>${label}</label>
            <input type="number" value=${value} />
            <small class="form-text">${this.validate('number', value)}</small>
          </div>`;
        break;
      default:
        field = html`
          <div class="form-group">
            <label>${label}</label>
            <input type="text" value=${value} />
          </div>`;
    }
    this.fields.push(field);
    return this;
  }

  addButton(text: string, onClick?: () => void) {
    this.fields.push(html`<button type="button" @click=${onClick}>${text}</button>`);
    return this;
  }

  // Convenience: add a BlnTree
  addBlnTree(props: Partial<BlnTreePropsType> & { items?: BlnTreeNodeType[] } = {}) {
    const tpl = html`<bln-tree
      .items=${props.items ?? []}
      .selectedIds=${props.selectedIds ?? []}
      .expandedIds=${props.expandedIds ?? []}
      .multiSelect=${props.multiSelect ?? false}
      aria-label=${props.ariaLabel ?? ''}
      aria-labelledby=${props.ariaLabelledby ?? ''}
      aria-describedby=${props.ariaDescribedby ?? ''}
      class=${props.class ?? ''}
    ></bln-tree>`;
    this.fields.push(tpl);
    return this;
  }

  // Convenience: add a BlnCheckbox
  addBlnCheckbox(props: Partial<BlnCheckBoxProps> = {}) {
    const tpl = html`<bln-checkbox
      .label=${props.label ?? ''}
      .name=${props.name ?? ''}
      .value=${props.value ?? 'on'}
      .checked=${props.checked ?? false}
      .disabled=${props.disabled ?? false}
      .required=${props.required ?? false}
      .hint=${props.hint ?? ''}
      .cornerHint=${props.cornerHint ?? ''}
      .class=${props.class ?? ''}
    ></bln-checkbox>`;
    this.fields.push(tpl);
    return this;
  }

  // Convenience: add a ModernTree
  addModernTree(model: IDataModel, opts: { level?: number } = {}) {
    const tpl = html`<modern-tree
      .dataModel=${model}
      .level=${opts.level ?? 0}
    ></modern-tree>`;
    this.fields.push(tpl);
    return this;
  }

  // Convenience: add a BlnToast
  addBlnToast(props: Partial<BlnToastProps> = {}) {
    const tpl = html`<bln-toast
      .open=${props.open ?? false}
      .variant=${props.variant ?? 'info'}
      .title=${props.title ?? ''}
      .message=${props.message ?? ''}
      .autoHide=${props.autoHide ?? true}
      .autoHideDelay=${props.autoHideDelay ?? 4000}
      .closeButton=${props.closeButton ?? true}
      .ariaLive=${props.ariaLive ?? 'polite'}
      .ariaAtomicBool=${props.ariaAtomic ?? true}
      .class=${props.class ?? ''}
    ></bln-toast>`;
    this.fields.push(tpl);
    return this;
  }

  // Convenience: add a BlnSelect
  addBlnSelect(props: Partial<BlnSelectProps> = {}) {
    const tpl = html`<bln-select
      .label=${props.label ?? ''}
      .cornerHint=${props.cornerHint ?? ''}
      .hint=${props.hint ?? ''}
      .name=${props.name ?? ''}
      .placeholder=${props.placeholder ?? ''}
      .value=${props.value ?? ''}
      .disabled=${props.disabled ?? false}
      .required=${props.required ?? false}
      .multiple=${props.multiple ?? false}
      .size=${props.size ?? 'medium'}
      .class=${props.class ?? ''}
      .options=${props.options ?? []}
      .ariaLabel=${props.ariaLabel ?? ''}
      .ariaLabelledby=${props.ariaLabelledby ?? ''}
      .ariaDescribedby=${props.ariaDescribedby ?? ''}
    ></bln-select>`;
    this.fields.push(tpl);
    return this;
  }

  // Convenience: add a BlnButton
  addBlnButton(label: string, props: Partial<BlnButtonProps> = {}, onClick?: (e: MouseEvent) => void) {
    const tpl = html`<bln-button
      .variant=${(props.variant as any) ?? 'solid'}
      .size=${props.size ?? 'medium'}
      .withArrow=${props.withArrow ?? false}
      .withStripes=${props.withStripes ?? false}
      .disabled=${props.disabled ?? false}
      .class=${props.class ?? ''}
      .onClick=${onClick}
    >${label}</bln-button>`;
    this.fields.push(tpl);
    return this;
  }

  getFields() {
    return this.fields;
  }
}