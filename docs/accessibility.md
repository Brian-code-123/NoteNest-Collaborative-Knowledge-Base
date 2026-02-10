# Frontend Accessibility Guidelines

This document outlines the accessibility standards and best practices for the NoteNest frontend application, ensuring compliance with WCAG 2.1 AA standards.

## Overview

NoteNest is committed to providing an inclusive user experience for all users, including those using assistive technologies. This document serves as a reference for developers and contributors to maintain accessibility standards.

## Standards Compliance

- **WCAG 2.1 AA**: All new features must meet or exceed WCAG 2.1 AA standards
- **Keyboard Navigation**: All interactive elements must be accessible via keyboard
- **Screen Reader Support**: Content must be understandable and navigable with screen readers
- **Color Contrast**: Minimum 4.5:1 contrast ratio for normal text, 3:1 for large text
- **Focus Management**: Clear focus indicators and logical tab order

## Component Guidelines

### Buttons
- Use semantic `<button>` elements or elements with `role="button"`
- Include descriptive `aria-label` or `aria-labelledby` when text alone is insufficient
- Support keyboard activation (Enter/Space)
- Provide loading states with `aria-busy="true"`

### Forms
- Associate labels with inputs using `<label>` elements or `aria-labelledby`
- Use `aria-describedby` for error messages and help text
- Mark required fields with `aria-required="true"` and visual indicators
- Provide clear error messaging with `role="alert"`

### Navigation
- Use semantic `<nav>` elements with `aria-label` for navigation landmarks
- Mark current page with `aria-current="page"`
- Ensure skip links are available for keyboard users

### Headings
- Use proper heading hierarchy (h1 → h2 → h3, etc.)
- Avoid skipping heading levels
- Provide descriptive heading text

### Images and Icons
- Decorative images: `aria-hidden="true"` or `alt=""`
- Informative images: Descriptive `alt` text
- Icons: `aria-hidden="true"` unless they convey meaning

### Focus Management
- Visible focus indicators with 3px minimum border and sufficient contrast
- Logical tab order following DOM order
- Focus should not get trapped in modals or overlays
- Skip links to main content areas

## Keyboard Shortcuts

### Global Shortcuts
- `Tab` / `Shift+Tab`: Navigate between focusable elements
- `Enter`: Activate buttons and links
- `Space`: Activate buttons, toggle checkboxes
- `Escape`: Close modals, dismiss notifications

### Application Shortcuts (when enabled)
- `/`: Focus search input
- `Ctrl+K` / `Cmd+K`: Open command palette
- `Ctrl+N`: Create new note (when applicable)

## Testing Procedures

### Manual Testing Checklist
- [ ] Navigate entire application using only Tab key
- [ ] Verify all interactive elements receive focus
- [ ] Test form submission and validation with keyboard
- [ ] Check modal dialogs can be closed with Escape
- [ ] Verify skip links work correctly
- [ ] Test with high contrast mode enabled

### Screen Reader Testing
- [ ] Test with NVDA (Windows) + Firefox
- [ ] Test with JAWS (Windows) + Chrome
- [ ] Test with VoiceOver (macOS) + Safari
- [ ] Verify landmark navigation
- [ ] Check form labels and error announcements

### Automated Testing
- [ ] Run Lighthouse accessibility audit
- [ ] Use axe-core browser extension
- [ ] Check color contrast with browser dev tools
- [ ] Validate HTML with WAVE tool

## Color Contrast Requirements

### Text on Background
- Normal text (under 18pt): 4.5:1 minimum contrast ratio
- Large text (18pt+ or 14pt+ bold): 3:1 minimum contrast ratio
- Non-text content: 3:1 minimum contrast ratio

### Focus Indicators
- Focus rings must have 3:1 contrast against adjacent colors
- Focus indicators should be at least 2px thick

## ARIA Usage Guidelines

### When to Use ARIA
- Use native HTML elements when possible
- Only add ARIA when native semantics are insufficient
- Test with screen readers after adding ARIA

### Common ARIA Patterns
- `aria-label`: Provide accessible name when no visible label exists
- `aria-describedby`: Link to additional description or error text
- `aria-expanded`: Indicate expandable/collapsible elements
- `aria-live`: Announce dynamic content changes
- `aria-current`: Mark current item in navigation

## Form Accessibility

### Input Fields
```tsx
<label htmlFor="email-input">Email Address</label>
<input
  id="email-input"
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
{hasError && (
  <div id="email-error" role="alert">
    Please enter a valid email address
  </div>
)}
```

### Required Fields
```tsx
<label htmlFor="name-input">
  Full Name <span aria-label="required">*</span>
</label>
<input
  id="name-input"
  required
  aria-required="true"
/>
```

## Modal and Dialog Accessibility

### Modal Structure
```tsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Modal Title</h2>
  <button aria-label="Close modal">×</button>
  <!-- Modal content -->
</div>
```

### Focus Management
- Focus should move to modal when opened
- Focus should be trapped within modal
- Focus should return to trigger element when closed
- Escape key should close modal

## Error Handling

### Error Announcements
- Use `role="alert"` for error messages
- Ensure errors are announced by screen readers
- Provide clear, actionable error messages

### Form Validation
- Validate on blur and submission
- Display errors inline with associated fields
- Allow users to correct errors and resubmit

## Performance Considerations

### Reduced Motion
- Respect `prefers-reduced-motion` setting
- Disable animations for users who prefer reduced motion
- Provide alternative static indicators

### Loading States
- Use `aria-busy="true"` during loading
- Provide progress indicators when appropriate
- Ensure loading states don't prevent keyboard navigation

## Browser Support

- Modern browsers with accessibility features enabled
- IE11 support discontinued (focus on evergreen browsers)
- Mobile screen readers (TalkBack, VoiceOver on mobile)

## Resources

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe-core](https://github.com/dequelabs/axe-core)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://developer.paciellogroup.com/resources/contrastanalyser/)

### References
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Accessibility Resources](https://webaim.org/resources/)

## Contributing

When contributing to NoteNest:

1. **Review accessibility impact** of all UI changes
2. **Test with keyboard navigation** before submitting PRs
3. **Include accessibility considerations** in PR descriptions
4. **Update this document** when new patterns are established
5. **Ask for accessibility review** on complex UI changes

## Contact

For accessibility questions or concerns, please reach out to the development team or create an issue with the "accessibility" label.
