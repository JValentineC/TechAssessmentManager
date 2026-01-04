-- Add 'composite' to task_type ENUM
ALTER TABLE tasks 
MODIFY COLUMN task_type ENUM(
  'single_input',
  'multiple_inputs', 
  'file_upload',
  'code_editor',
  'multiple_choice',
  'checkbox_list',
  'text_area',
  'drag_drop_upload',
  'composite'
) DEFAULT 'single_input';
