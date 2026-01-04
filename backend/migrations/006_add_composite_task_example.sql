-- Example: Update Task 1 to use composite task type with multiple components

UPDATE assessment_tasks 
SET 
  task_type = 'composite',
  task_config = '{
    "components": [
      {
        "type": "info_text",
        "text": "Complete all sections below to demonstrate your understanding of shared document collaboration.",
        "style": "info"
      },
      {
        "type": "text_input",
        "label": "1. Document Link",
        "description": "Paste the link to your shared Google Doc",
        "placeholder": "https://docs.google.com/...",
        "required": true
      },
      {
        "type": "text_area",
        "label": "2. Summary of Changes",
        "description": "Describe the two sentences you added to the document",
        "placeholder": "I added...",
        "rows": 4,
        "required": true,
        "maxLength": 500
      },
      {
        "type": "text_area",
        "label": "3. Comments Added",
        "description": "List the constructive comments you added (minimum 2)",
        "placeholder": "1. ...\n2. ...",
        "rows": 6,
        "required": true
      },
      {
        "type": "multiple_choice",
        "label": "4. Permission Level Set",
        "description": "What permission level did you grant to your peer?",
        "required": true,
        "options": [
          {"value": "viewer", "label": "Viewer (can only view)"},
          {"value": "commenter", "label": "Commenter (can view and comment)"},
          {"value": "editor", "label": "Editor (can view, comment, and edit)"}
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "code_block",
        "label": "5. README Example",
        "description": "Below is a template README. Review it and edit if needed:",
        "language": "markdown",
        "readOnly": false,
        "rows": 10,
        "templateCode": "# Project README\n\n## Purpose\nCollaboration exercise for shared document editing\n\n## Owner\n[Your Name]\n\n## How to Contribute\n1. Request edit access\n2. Add constructive comments\n3. Make suggested edits\n4. Communicate changes with team"
      },
      {
        "type": "checkbox",
        "label": "6. Checklist",
        "description": "Confirm you completed all requirements:",
        "options": [
          {"value": "edits", "label": "Added two sentences to the document"},
          {"value": "comments", "label": "Added at least 2 constructive comments"},
          {"value": "permissions", "label": "Changed permissions so peer can edit"},
          {"value": "readme", "label": "Created README in the folder"}
        ]
      }
    ]
  }'
WHERE id = 1;
