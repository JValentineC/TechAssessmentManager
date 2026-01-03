-- Add task_type and task_config columns to tasks table
ALTER TABLE tasks 
ADD COLUMN task_type ENUM(
  'single_input',
  'multiple_inputs', 
  'file_upload',
  'code_editor',
  'multiple_choice',
  'checkbox_list',
  'text_area',
  'drag_drop_upload'
) DEFAULT 'single_input' AFTER max_points;

ALTER TABLE tasks 
ADD COLUMN task_config JSON DEFAULT NULL AFTER task_type;

-- Update existing tasks to have default configuration
UPDATE tasks 
SET task_type = 'single_input', 
    task_config = '{"placeholder": "Enter your answer...", "validation": {"required": true}}'
WHERE task_type IS NULL;
