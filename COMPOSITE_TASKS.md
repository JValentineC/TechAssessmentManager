# Composite Task Configuration Guide

The `composite` task type allows you to combine multiple components in a single task, giving you full flexibility to create complex assignments.

## Task Structure

```json
{
  "task_type": "composite",
  "task_config": {
    "components": [
      // Array of component objects
    ]
  }
}
```

## Available Components

### 1. Text Input

Single-line text input field.

```json
{
  "type": "text_input",
  "label": "Question text",
  "description": "Optional helper text",
  "placeholder": "Placeholder text",
  "required": true,
  "minLength": 10,
  "maxLength": 100
}
```

### 2. Text Area

Multi-line text input.

```json
{
  "type": "text_area",
  "label": "Question text",
  "description": "Optional helper text",
  "placeholder": "Enter your answer",
  "rows": 6,
  "required": true,
  "minLength": 50,
  "maxLength": 1000
}
```

### 3. Code Block

Code editor with syntax highlighting.

```json
{
  "type": "code_block",
  "label": "Code Exercise",
  "description": "Write your solution below",
  "language": "python",
  "readOnly": false,
  "rows": 15,
  "templateCode": "def hello():\n    pass"
}
```

**Options:**

- `language`: "python", "javascript", "sql", "html", "css", "markdown", etc.
- `readOnly`: Set to `true` for reference code that students can't edit
- `templateCode`: Starter code to pre-fill

### 4. Multiple Choice

Radio button selection (single choice).

```json
{
  "type": "multiple_choice",
  "label": "Select the correct answer",
  "description": "Choose one option",
  "required": true,
  "options": [
    { "value": "a", "label": "Option A" },
    { "value": "b", "label": "Option B" },
    { "value": "c", "label": "Option C" }
  ]
}
```

### 5. Checkbox (Multiple Selection)

Checkbox list for multiple selections.

```json
{
  "type": "checkbox",
  "label": "Select all that apply",
  "description": "Choose multiple options",
  "options": [
    { "value": "opt1", "label": "First option" },
    { "value": "opt2", "label": "Second option" },
    { "value": "opt3", "label": "Third option" }
  ]
}
```

### 6. Number Input

Numeric input with min/max validation.

```json
{
  "type": "number_input",
  "label": "Enter a number",
  "placeholder": "0",
  "required": true,
  "min": 0,
  "max": 100,
  "step": 1
}
```

### 7. Divider

Visual separator between sections.

```json
{
  "type": "divider"
}
```

### 8. Info Text

Display informational message with styling.

```json
{
  "type": "info_text",
  "text": "Important: Read all instructions carefully.",
  "style": "info"
}
```

**Styles:**

- `"info"` - Blue background (default)
- `"warning"` - Yellow background
- `"success"` - Green background

## Complete Example

Here's a comprehensive task combining multiple components:

```sql
UPDATE assessment_tasks
SET
  task_type = 'composite',
  task_config = '{
    "components": [
      {
        "type": "info_text",
        "text": "This task has multiple parts. Complete all sections.",
        "style": "info"
      },
      {
        "type": "text_input",
        "label": "1. Your Name",
        "placeholder": "Enter your full name",
        "required": true
      },
      {
        "type": "divider"
      },
      {
        "type": "code_block",
        "label": "2. Review This Code",
        "description": "Read the code below (cannot be edited)",
        "language": "python",
        "readOnly": true,
        "rows": 8,
        "templateCode": "def calculate_total(items):\n    return sum(item.price for item in items)\n\n# Example usage\ntotal = calculate_total(shopping_cart)"
      },
      {
        "type": "text_area",
        "label": "3. Explain the Code",
        "description": "In your own words, explain what the code above does",
        "rows": 4,
        "required": true,
        "maxLength": 300
      },
      {
        "type": "divider"
      },
      {
        "type": "multiple_choice",
        "label": "4. What does this function return?",
        "required": true,
        "options": [
          {"value": "list", "label": "A list of items"},
          {"value": "sum", "label": "The sum of all prices"},
          {"value": "count", "label": "The count of items"}
        ]
      },
      {
        "type": "checkbox",
        "label": "5. Checklist",
        "description": "Confirm you completed all requirements:",
        "options": [
          {"value": "read", "label": "I read the code carefully"},
          {"value": "understand", "label": "I understand what it does"},
          {"value": "answered", "label": "I answered all questions"}
        ]
      }
    ]
  }'
WHERE id = 1;
```

## Tips

1. **Start with `info_text`** - Set expectations at the beginning
2. **Use `divider`** - Separate logical sections
3. **Mix input types** - Combine text, code, and multiple choice for variety
4. **Use `readOnly` code blocks** - Show reference code students analyze
5. **Add descriptions** - Guide students with helper text
6. **Validate inputs** - Use `required`, `minLength`, `maxLength` for quality control

## Migration Template

```sql
-- Create/Update a composite task
UPDATE assessment_tasks
SET
  task_type = 'composite',
  title = 'Task Title',
  instructions = 'Overall task instructions shown at the top',
  max_points = 10,
  task_config = '{
    "components": [
      // Add your components here
    ]
  }'
WHERE id = X;
```
