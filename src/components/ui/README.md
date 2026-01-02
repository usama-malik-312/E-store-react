# UI Components

Reusable UI components for the Electric Store Management System. These components follow a modern, clean, and minimal design style with soft shadows, rounded corners, and clear typography.

## Components

### Button

A versatile button component with multiple variants and icon support.

```tsx
import { Button } from "@/components/ui";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

// Primary button
<Button variant="primary" onClick={handleClick}>
  Add Product
</Button>

// With icon
<Button variant="primary" icon={<PlusOutlined />}>
  New Invoice
</Button>

// Secondary button
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>

// Destructive button
<Button variant="destructive" icon={<DeleteOutlined />}>
  Delete
</Button>

// Loading state
<Button variant="primary" isLoading>
  Saving...
</Button>
```

**Props:**
- `variant`: "primary" | "secondary" | "destructive" (default: "primary")
- `icon`: ReactNode - Optional icon element
- `isLoading`: boolean - Shows loading spinner
- All standard button HTML attributes

---

### InputField

Input component for text, email, password, and number inputs with validation support.

```tsx
import { InputField } from "@/components/ui";

// Basic input
<InputField
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With error
<InputField
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error="Password must be at least 8 characters"
/>

// With helper text
<InputField
  label="Phone Number"
  type="tel"
  placeholder="+1 (555) 000-0000"
  helperText="Include country code"
/>
```

**Props:**
- `label`: string - Input label
- `error`: string - Error message to display
- `helperText`: string - Helper text below input
- All standard input HTML attributes

---

### Card

Container component for grouping related content.

```tsx
import { Card } from "@/components/ui";

// Basic card
<Card>
  <p>Card content goes here</p>
</Card>

// With title
<Card title="Product Overview">
  <p>Card content</p>
</Card>

// With title and header action
<Card
  title="Recent Invoices"
  subtitle="Last 10 invoices"
  headerAction={<Button variant="primary">View All</Button>}
>
  <p>Card content</p>
</Card>

// Custom padding
<Card padding="lg">
  <p>Content with large padding</p>
</Card>
```

**Props:**
- `title`: string - Card title
- `subtitle`: string - Card subtitle
- `headerAction`: ReactNode - Action button in header
- `padding`: "none" | "sm" | "md" | "lg" (default: "md")

---

### Table

Generic table component for displaying tabular data.

```tsx
import { Table } from "@/components/ui";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Price", accessor: "price" },
  { header: "Stock", accessor: "stock" },
  {
    header: "Status",
    accessor: (row) => (
      <span className={row.stock < 10 ? "text-red-500" : "text-green-500"}>
        {row.stock < 10 ? "Low Stock" : "In Stock"}
      </span>
    ),
  },
];

const data = [
  { id: 1, name: "Wire", price: 10.99, stock: 5 },
  { id: 2, name: "Switch", price: 5.99, stock: 20 },
];

<Table
  columns={columns}
  data={data}
  onRowClick={(row) => console.log("Clicked:", row)}
  emptyMessage="No products found"
/>
```

**Props:**
- `columns`: Array of column definitions
  - `header`: string - Column header
  - `accessor`: string | function - Data accessor or render function
  - `className`: string - Custom cell class
  - `cellClassName`: string | function - Conditional cell styling
- `data`: Array of data objects
- `keyExtractor`: function - Custom key extractor
- `onRowClick`: function - Row click handler
- `emptyMessage`: string - Message when no data
- `isLoading`: boolean - Shows loading spinner

---

### Modal

Modal dialog component for confirmations and forms.

```tsx
import { Modal, Button } from "@/components/ui";

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Delete Product"
  size="md"
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  }
>
  <p>Are you sure you want to delete this product? This action cannot be undone.</p>
</Modal>
```

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: function - Close handler
- `title`: string - Modal title
- `size`: "sm" | "md" | "lg" | "xl" | "full" (default: "md")
- `showCloseButton`: boolean (default: true)
- `closeOnOverlayClick`: boolean (default: true)
- `footer`: ReactNode - Footer content

---

### Select

Dropdown/select component for choices.

```tsx
import { Select } from "@/components/ui";

const categories = [
  { label: "Wires", value: "wires" },
  { label: "Switches", value: "switches" },
  { label: "Outlets", value: "outlets" },
];

<Select
  label="Category"
  options={categories}
  placeholder="Select a category"
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
/>

// With error
<Select
  label="Role"
  options={roles}
  error="Please select a role"
  required
/>
```

**Props:**
- `label`: string - Select label
- `options`: Array of { label, value, disabled? }
- `error`: string - Error message
- `helperText`: string - Helper text
- `placeholder`: string - Placeholder option
- All standard select HTML attributes

---

## Design Principles

All components follow these design principles:

- **Light Theme First**: Optimized for light theme with dark mode support
- **Soft Shadows**: Subtle shadows using `shadow-sm` and `shadow-md`
- **Rounded Corners**: Consistent `rounded-lg` and `rounded-xl` for cards
- **Clear Typography**: Clean, readable fonts with proper hierarchy
- **Smooth Transitions**: 200ms transitions for interactive elements
- **Responsive**: Desktop-first with mobile considerations
- **Accessible**: Proper labels, ARIA attributes, and keyboard navigation

## Styling

Components use Tailwind CSS classes and support:
- Dark mode via `dark:` prefix
- Custom className props for additional styling
- Consistent spacing and sizing
- Focus states for accessibility


