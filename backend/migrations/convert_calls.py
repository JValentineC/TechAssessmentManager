#!/usr/bin/env python3
"""Convert CALL statements to INSERT statements in SQL seed file"""
import re
from datetime import datetime, timedelta

input_file = '012_seed_cycle58_fixed.sql'
output_file = '012_seed_cycle58_fixed_converted.sql'

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match CALL statements
# CALL create_submission_with_score('email', cohort_id, assessment_id, task_id, score, 'date');
pattern = r"CALL create_submission_with_score\('([^']+)', (\d+), (\d+), (\d+), (\d+), '([^']+)'\);"

def convert_call(match):
    email = match.group(1)
    cohort_id = match.group(2)
    assessment_id = match.group(3)
    task_id = match.group(4)
    score = match.group(5)
    submission_date = match.group(6)
    
    # Calculate scored_at date (1 day after submission)
    dt = datetime.strptime(submission_date, '%Y-%m-%d %H:%M:%S')
    scored_date = (dt + timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')
    
    # Generate the two INSERT statements
    result = f"""INSERT INTO submissions (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
SELECT id, {cohort_id}, {assessment_id}, {task_id}, 'submitted', '{submission_date}', '{submission_date}' FROM users WHERE email='{email}';
INSERT INTO scores (submission_id, rubric_score, scored_by, scored_at) VALUES (LAST_INSERT_ID(), {score}, 2, '{scored_date}');
"""
    return result

# Replace all CALL statements
converted = re.sub(pattern, convert_call, content)

# Write the converted content
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(converted)

print(f"✓ Converted file saved to: {output_file}")
print(f"✓ Found and converted {len(re.findall(pattern, content))} CALL statements")
