# Testing checklist

## Calculations

- [ ] Qty 2 × 100.00 = 200.00
- [ ] 10% item discount on 200.00 = 180.00
- [ ] Fixed item discount cannot exceed the line
- [ ] Document percent discount applies after item discounts
- [ ] Exclusive 18% tax on 100.00 = tax 18.00, total 118.00
- [ ] Inclusive 18% tax on 118.00 extracts tax 18.00, total 118.00
- [ ] Empty unused rows are ignored
- [ ] Preview, print, and PDF show the same numbers

## Form and validation

- [ ] Business name required
- [ ] Customer name or company required
- [ ] At least one described item required
- [ ] Invalid emails rejected; blank emails allowed
- [ ] Validity date cannot precede quotation date
- [ ] Reset generates a new quotation number
- [ ] Logo rejects non-images and oversized files

## Persistence

- [ ] Refresh keeps the current form
- [ ] Save draft appears in the drafts list
- [ ] Load draft restores items and logo
- [ ] Delete draft removes only that entry

## Responsive and a11y

- [ ] Desktop: form and preview side by side
- [ ] Mobile: Form / Preview tabs
- [ ] Keyboard can reach every control
- [ ] Skip link works
- [ ] Buttons have visible focus
- [ ] Print hides chrome and keeps the sheet

## Export

- [ ] PDF downloads with the quotation number as filename
- [ ] Multi-page quotes create extra PDF pages
- [ ] Print dialog opens
