import {describe, it, expect, beforeEach} from 'vitest';
import './BlnFooter';

describe('BlnFooter', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const mount = async (props: Partial<{ title: string; subTitle: string; links: {title: string; url: string}[] }>= {}) => {
    const el = document.createElement('bln-footer') as any;
    Object.entries(props).forEach(([k, v]) => ((el as any)[k] = v));
    document.body.appendChild(el);
    await (el as any).updateComplete;
    return el as HTMLElement & { shadowRoot: ShadowRoot };
  };

  it('renders with defaults', async () => {
    const el = await mount();
    const title = el.shadowRoot?.querySelector('span');
    const sub = el.shadowRoot?.querySelector('small');
    expect(title?.textContent).toContain('Das offizielle Hauptstadtportal');
    expect(sub?.textContent).toContain('Berlin.de');
  });

  it('accepts links and renders them', async () => {
    const el = await mount({
      links: [
        {title: 'Impressum', url: '/impressum'},
        {title: 'Datenschutz', url: '/datenschutz'},
      ]
    });
    const links = Array.from(el.shadowRoot!.querySelectorAll('a'));
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('/impressum');
    expect(links[0].textContent).toContain('Impressum');
  });

  it('has contentinfo role on footer', async () => {
    const el = await mount();
    const footer = el.shadowRoot!.querySelector('footer');
    expect(footer?.getAttribute('role')).toBe('contentinfo');
  });
});
