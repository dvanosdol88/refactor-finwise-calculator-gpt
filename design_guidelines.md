# Financial Fee Savings Calculator - Design Guidelines

## Design Approach
**System-Based Approach** using modern web application patterns with a professional financial services aesthetic. The design emphasizes clarity, trust, and data visualization while maintaining an approachable, interactive feel.

## Core Design Principles
1. **Data-First Presentation**: Calculator controls and results are the primary focus
2. **Progressive Disclosure**: Information reveals through interaction (carousel, survey popup)
3. **Professional Trust**: Clean, corporate aesthetic suitable for financial services
4. **Interactive Engagement**: Dynamic calculations, surveys, and visual feedback

## Typography System

**Heading Font**: Montserrat
- H1: 2xl to 5xl (responsive), font-weight: 800, gradient text treatment
- H2-H6: Montserrat, font-weight: 600
- Use for all headings, labels, and numeric displays

**Body Font**: Source Sans 3
- Body text: 400 weight
- Emphasized text: 600 weight
- Use for paragraphs, descriptions, and general content

**Numeric Displays**: Montserrat 600-800 for all currency and statistical values

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 32
- Section padding: py-4 to py-12
- Card padding: p-4 to p-6
- Gap between elements: gap-4 to gap-8
- Margin bottom: mb-6, mb-8, mb-12

**Container Strategy**:
- Overall wrapper: min-h-screen with p-4 sm:p-6 lg:p-8
- Main content: max-w-7xl mx-auto
- Content sections: max-w-4xl mx-auto
- Cards: Full width within containers

## Color Palette

**Brand Colors** (from brand-colors-fonts.css):
- Primary Evergreen: #006044
- Light Green Accent: #76a923
- Gold Accent: #af8a49
- Text: #1a1a1a
- Text Muted: #4a4a4a
- Background: #ffffff
- Border: #e5e2dc

**Application-Specific Colors** (from implementation):
- Background: gray-50 (#f9fafb)
- Card backgrounds: white with border-gray-200
- Chart gradient: Green (#48BB78) with opacity gradient
- Success/savings: green-500 to green-600
- Interactive elements: blue-500 to blue-700
- Survey/popup: indigo-100, indigo-200, indigo-600

## Component Library

### Header Section
- Large, bold question format: "What would you do with an extra [AMOUNT]?"
- Solid Text Color: Used for the headline. (Currently set to the brand green, e.g., #01793d)
- Calculator controls in white rounded card (rounded-xl) with subtle shadow

### Calculator Controls
- Inline input fields with auto-sizing width based on content
- Custom styling: white bg, border-[var(--border)], rounded-md
- Prefix/suffix support for currency ($) and percentages (%)
- Custom select dropdown with SVG arrow
- Reset button: circular (h-10 w-10), rounded-full, SVG icon
- Flex-wrap layout for responsive arrangement

### Savings Display (Carousel)
- Three-panel layout: stat card | question icon | stat card
- Navigation arrows on sides (opacity-60, hover:opacity-100)
- Animated transitions with animate-fadeIn
- Stats cards: white bg, rounded-2xl, shadow-lg, p-6
- Currency values: 3xl, font-bold, brand-primary for savings
- Question icon: indigo theme, rotated -12deg, animate-pulse-slow

### Survey Popup
- Absolute positioned, w-80, white bg, rounded-xl shadow-lg
- Radio buttons with percentage display
- Close button (top-right)
- LocalStorage persistence for vote tracking
- Appears on hover/focus of question icon

### Chart Section
- White card: rounded-2xl, shadow-lg, border-gray-200
- Height: 400px (mobile) to 500px (desktop)
- Recharts AreaChart with gradient fill
- Custom tooltip: white/80 backdrop-blur, rounded-lg
- Axis styling: gray tones (#9ca3af, #6b7280)
- Single legend badge: border-blue-200, rounded px-3 py-1

### Footer
- Centered text, gray-600, text-sm
- Multiple disclaimer paragraphs
- mt-12 spacing from content

## Visual Treatments

**Borders & Shadows**:
- Cards: border-gray-200 with shadow-lg
- Inputs: border-[var(--border)] with focus ring
- Popups: shadow-lg with border

**Rounded Corners**:
- Cards: rounded-2xl (large cards), rounded-xl (medium cards)
- Inputs: rounded-md
- Buttons: rounded-full (icon buttons), rounded-md (standard)
- Badges: rounded-full

**Animations** (minimal, purposeful):
- fadeIn: 0.3s ease-out (opacity 0→1, translateY -8px→0)
- pulse-slow: 2s infinite for attention (question icon)
- Carousel transitions: key-based re-rendering

**Gradients**:
- Text gradient (headline): from-green-500 to-blue-600 with bg-clip-text
- Chart area fill: Linear gradient #48BB78 (80% opacity → 0%)

## Interaction Patterns

**Calculator**:
- Real-time calculations on input change
- Auto-formatted currency display (Intl.NumberFormat)
- Reset button returns to defaults

**Carousel Navigation**:
- Left/right arrows cycle through views
- Smooth content replacement with animation
- No auto-advance (user-controlled)

**Survey**:
- Hover to reveal popup
- Single vote per user (localStorage)
- Live percentage updates
- Disabled state after voting

**Responsive Behavior**:
- Flex-wrap for controls (stacks on mobile)
- Text sizes scale (text-2xl sm:text-3xl lg:text-4xl)
- Chart height adjusts (400px → 500px)
- Padding increases with viewport (p-4 sm:p-6 lg:p-8)

## Accessibility

- Semantic HTML structure
- ARIA labels on icon-only buttons ("Previous stat", "Next stat", "Reset to default values")
- Focus states with ring-2, ring-blue-500
- Keyboard navigation support
- High contrast text colors
- Disabled states clearly communicated

## Images

**No hero images required** - This is a utility-focused calculator tool where data visualization and interactive controls are the primary visual elements. The gradient text headline provides visual impact without imagery.