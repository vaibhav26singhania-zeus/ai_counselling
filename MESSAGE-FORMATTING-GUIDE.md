# Message Formatting Guide

## Overview

The chatbot now supports rich text formatting in responses with headers, bold text, lists, code blocks, and more!

## Supported Formatting

### Headers

```
# Main Title (H1)
## Section Header (H2)
### Subsection (H3)
```

**Renders as:**
- Large, bold titles
- Section headers with underline
- Smaller subsection headers

### Text Styling

```
**Bold text** or __Bold text__
*Italic text* or _Italic text_
```

**Renders as:**
- **Bold text** - Important points
- *Italic text* - Emphasis

### Lists

**Bullet Lists:**
```
- First item
- Second item
- Third item
```

**Numbered Lists:**
```
1. First step
2. Second step
3. Third step
```

**Renders as:**
- Bullet points with green dots
- Numbered lists with green numbers
- Proper spacing and indentation

### Code

**Inline Code:**
```
Use `code` for inline code
```

**Code Blocks:**
```
```
function example() {
  return "formatted code";
}
```
```

**Renders as:**
- Inline code with gray background
- Code blocks with dark background
- Monospace font

### Links

```
[Link text](https://example.com)
```

**Renders as:**
- Clickable green links
- Opens in new tab

## Example Responses

### Example 1: Financial Advice

**Input:** "What is SIP?"

**Formatted Response:**
```
## SIP (Systematic Investment Plan)

SIP is a method of investing in **mutual funds** where you invest a fixed amount regularly.

### Key Benefits:
- **Rupee Cost Averaging**: Buy more units when prices are low
- **Disciplined Investing**: Automatic monthly investments
- **Power of Compounding**: Long-term wealth creation
- **Flexibility**: Start with as low as ₹500

### How to Start:
1. Choose a mutual fund
2. Decide investment amount
3. Set up auto-debit
4. Monitor quarterly

**Tip**: Start early to maximize returns!
```

### Example 2: Tax Saving

**Input:** "How to save tax?"

**Formatted Response:**
```
## Tax Saving Options in India

### Section 80C (Up to ₹1.5 Lakh)
- **ELSS Funds**: Equity-linked savings schemes
- **PPF**: Public Provident Fund
- **EPF**: Employee Provident Fund
- **Life Insurance**: Premium payments

### Section 80D (Health Insurance)
- Self & Family: ₹25,000
- Parents: Additional ₹25,000
- Senior Citizen Parents: ₹50,000

### Section 80CCD(1B) (NPS)
Additional ₹50,000 deduction for NPS contributions

**Pro Tip**: Combine multiple sections for maximum savings!
```

### Example 3: Step-by-Step Guide

**Input:** "How to invest in mutual funds?"

**Formatted Response:**
```
## Investing in Mutual Funds

### Step 1: Complete KYC
- Visit any AMC website
- Upload Aadhaar & PAN
- Complete video verification

### Step 2: Choose Fund Type
- **Equity Funds**: High risk, high return
- **Debt Funds**: Low risk, stable return
- **Hybrid Funds**: Balanced approach

### Step 3: Investment Method
1. Lump sum investment
2. SIP (Systematic Investment Plan)
3. STP (Systematic Transfer Plan)

### Step 4: Monitor & Review
- Check performance quarterly
- Rebalance annually
- Stay invested for long term

**Remember**: Past performance doesn't guarantee future returns!
```

## How It Works

### Frontend (MessageFormatter.jsx)

The component parses markdown-like syntax:

```javascript
// Headers
## Header → <h2 class="msg-header">Header</h2>

// Bold
**text** → <strong>text</strong>

// Lists
- item → <li class="msg-bullet">item</li>

// Code
`code` → <code class="msg-inline-code">code</code>
```

### Backend (server.js)

The LLM is instructed to format responses:

```javascript
const systemPrompt = `
Format your responses well:
- Use ## for main topics
- Use ### for subtopics
- Make important points **bold**
- Use - or 1. for lists
`;
```

## Styling

### Colors
- Headers: Dark blue/gray
- Bold text: Black
- Bullet points: Green
- Code: Red (inline), White on dark (blocks)
- Links: Green

### Spacing
- Headers have top/bottom margins
- Lists have proper indentation
- Code blocks have padding
- Line breaks preserved

## Testing

### Test in Chat

Try these prompts to see formatting:

1. "Explain SIP with examples"
2. "Give me 5 tax saving tips"
3. "How to create emergency fund step by step"
4. "Compare FD vs Mutual Funds"

### Expected Output

You should see:
- ✅ Clear section headers
- ✅ Bold important terms
- ✅ Organized bullet lists
- ✅ Proper spacing
- ✅ Easy to read structure

## Customization

### Change Colors

Edit `src/App.css`:

```css
.message-content .msg-header {
  color: #your-color;
  border-bottom: 2px solid #your-color;
}

.message-content .msg-bullet::before {
  color: #your-color; /* Bullet color */
}
```

### Change Fonts

```css
.message-content .msg-header {
  font-family: 'Your Font', sans-serif;
  font-size: 18px;
}
```

### Add New Formatting

In `MessageFormatter.jsx`:

```javascript
// Add blockquotes
html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

// Add horizontal rules
html = html.replace(/^---$/gm, '<hr/>')
```

## Benefits

### For Users
- ✅ Easier to read responses
- ✅ Clear structure and hierarchy
- ✅ Important points stand out
- ✅ Better comprehension

### For Developers
- ✅ No external markdown library needed
- ✅ Lightweight implementation
- ✅ Customizable styling
- ✅ Works with voice output

## Limitations

### Not Supported
- ❌ Tables
- ❌ Images
- ❌ Nested lists (more than 1 level)
- ❌ Complex markdown syntax

### Workarounds
- Use simple lists instead of tables
- Use text descriptions instead of images
- Keep lists flat (single level)

## Voice Output

When using text-to-speech:
- Formatting is stripped
- Only plain text is spoken
- Headers become natural pauses
- Lists are read sequentially

## Accessibility

The formatting improves accessibility:
- Semantic HTML (h2, h3, ul, ol)
- Proper heading hierarchy
- Screen reader friendly
- Keyboard navigation support

## Summary

Your chatbot now formats responses with:
- 📋 Headers and subheaders
- 💪 Bold and italic text
- 📝 Bullet and numbered lists
- 💻 Code blocks and inline code
- 🔗 Clickable links
- 🎨 Beautiful styling

Responses are now much easier to read and understand! 🎉
