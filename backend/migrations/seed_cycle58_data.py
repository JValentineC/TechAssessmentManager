"""
Seed Cycle 58 Assessment Data
This script populates the database with Cycle 58 interns and their assessment scores.
Also runs the enrollment_status migration if needed.

Usage: python seed_cycle58_data.py
"""

import mysql.connector
from mysql.connector import Error
from datetime import datetime

# Database configuration
DB_CONFIG = {
    'host': 'assessment.db',
    'database': 'AssessmentManager',
    'user': 'DevOps',
    'password': 'sakuraNarutoSasuke0208:'
}

# Cycle 58 Intern Data with enrollment status
INTERNS = [
    # Active
    ('Bonny Makaniankhondo', 'bmakaniankhondo@icstars.org', 'active'),
    ('Charlie Mejia', 'cmejia@icstars.org', 'active'),
    ('Dahlia Nunn', 'dnunn@icstars.org', 'active'),
    ('Maati Young', 'mayoung@icstars.org', 'active'),
    ('Maceo McBryde', 'mmcbryde@icstars.org', 'active'),
    ('Maya N. Huggins-Jordan', 'mhuggins-jordan@icstars.org', 'active'),
    ('Migoni Dowsey', 'mdowsey@icstars.org', 'active'),
    ('Nathan Jimenez', 'njimenez@icstars.org', 'active'),
    ('Penelope Darling', 'pdarling@icstars.org', 'active'),
    ('Thomas J Rosas', 'trosas@icstars.org', 'active'),
    ('Torell Pernell', 'tpernell@icstars.org', 'active'),
    ('Travion Ashford', 'tashford@icstars.org', 'active'),
    # Dismissed
    ('Darius Montgomery', 'dmontgomery@icstars.org', 'dismissed'),
    ('Debra Cooks', 'dcooks@icstars.org', 'dismissed'),
    ('Khayyel Johnson', 'kjohnson@icstars.org', 'dismissed'),
    # Resigned
    ('Mikal Shaffer', 'mshaffer@icstars.org', 'resigned'),
    ('Rachel Maynie', 'rmaynie@icstars.org', 'resigned'),
    ('Sofia Garcia', 'sgarcia@icstars.org', 'resigned'),
]

# Assessment scores: intern_email -> assessment_code -> [task1_score, task2_score, task3_score, task4_score]
# Note: Assessment A and B have 3 scored tasks, C and D have 4 scored tasks
SCORES = {
    'bmakaniankhondo@icstars.org': {
        'A': [4, 5, 4],
        'B': [5, 1, 3],
        'C': [5, 1, 3, 3],
        'D': [4, 5, 4, 1]
    },
    'cmejia@icstars.org': {
        'A': [4, 3, 4],
        'B': [3, 1, 4],
        'C': [3, 1, 4, 4],
        'D': [4, 1, 1, 1]
    },
    'dnunn@icstars.org': {
        'A': [4, 4, 4],
        'B': [4, 4, 4],
        'C': [4, 4, 4, 4],
        'D': [4, 5, 4, 1]
    },
    'dmontgomery@icstars.org': {
        'A': [3, 4, 4],
        'B': [3, 1, 2],
        'C': [],  # Dismissed before Assessment C
        'D': []   # Dismissed before Assessment D
    },
    'dcooks@icstars.org': {
        'A': [3, 2, 4],
        'B': [1, 3, 3],
        'C': [],  # Dismissed before Assessment C
        'D': []   # Dismissed before Assessment D
    },
    'kjohnson@icstars.org': {
        'A': [4, 2, 4],
        'B': [4, 2, 3],
        'C': [],  # Dismissed before Assessment C
        'D': []   # Dismissed before Assessment D
    },
    'mayoung@icstars.org': {
        'A': [4, 4, 4],
        'B': [1, 1, 2],
        'C': [1, 1, 2, 2],
        'D': [1, 1, 1, 1]
    },
    'mmcbryde@icstars.org': {
        'A': [4, 3, 4],
        'B': [2, 1, 2],
        'C': [2, 1, 2, 2],
        'D': [1, 1, 4, 1]
    },
    'mhuggins-jordan@icstars.org': {
        'A': [2, 3, 4],
        'B': [3, 2, 2],
        'C': [3, 2, 2, 2],
        'D': [1, 1, 1, 1]
    },
    'mdowsey@icstars.org': {
        'A': [4, 3, 3],
        'B': [3, 2, 3],
        'C': [3, 2, 3, 3],
        'D': [1, 1, 1, 1]
    },
    'mshaffer@icstars.org': {
        'A': [4, 4, 4],
        'B': [3, 1, 4],
        'C': [3, 1, 4, 4],
        'D': []  # Resigned before Assessment D
    },
    'njimenez@icstars.org': {
        'A': [4, 2, 4],
        'B': [3, 1, 2],
        'C': [3, 1, 2, 2],
        'D': [1, 1, 1, 1]
    },
    'pdarling@icstars.org': {
        'A': [4, 2, 4],
        'B': [3, 1, 2],
        'C': [3, 1, 2, 2],
        'D': [1, 1, 1, 1]
    },
    'rmaynie@icstars.org': {
        'A': [5, 2, 1],
        'B': [4, 1, 1],
        'C': [4, 1, 1, 1],
        'D': []  # Resigned before Assessment D
    },
    'sgarcia@icstars.org': {
        'A': [4, 3, 4],
        'B': [4, 3, 4],
        'C': [4, 3, 4, 4],
        'D': []  # Resigned before Assessment D
    },
    'trosas@icstars.org': {
        'A': [4, 2, 4],
        'B': [3, 3, 4],
        'C': [3, 3, 4, 4],
        'D': [1, 1, 1, 1]
    },
    'tpernell@icstars.org': {
        'A': [3, 4, 4],
        'B': [3, 1, 4],
        'C': [3, 1, 4, 4],
        'D': [1, 1, 1, 1]
    },
    'tashford@icstars.org': {
        'A': [4, 3, 4],
        'B': [3, 3, 2],
        'C': [3, 3, 2, 2],
        'D': [1, 1, 1, 1]
    }
}

# Assessment task mapping (assessment_id -> [task_ids])
ASSESSMENT_TASKS = {
    1: [1, 2, 3],      # Assessment A: tasks 1, 2, 3
    2: [5, 6, 7],      # Assessment B: tasks 5, 6, 7
    3: [9, 10, 11, 12],   # Assessment C: tasks 9, 10, 11, 12 (has 4 scored tasks)
    4: [13, 14, 15, 16]   # Assessment D: tasks 13, 14, 15, 16 (has 4 scored tasks)
}

def get_db_connection():
    """Create database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("Successfully connected to database")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def run_enrollment_status_migration(cursor):
    """Run the enrollment_status migration if not already applied"""
    try:
        # Check if column already exists
        cursor.execute("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'AssessmentManager' 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'enrollment_status'
        """)
        
        if cursor.fetchone():
            print("enrollment_status column already exists, skipping migration...")
            return
        
        print("Adding enrollment_status column to users table...")
        
        # Add enrollment_status column
        cursor.execute("""
            ALTER TABLE `users` 
            ADD COLUMN `enrollment_status` ENUM('active', 'dismissed', 'resigned') 
            NOT NULL DEFAULT 'active' 
            AFTER `status`
        """)
        
        # Add index
        cursor.execute("""
            ALTER TABLE `users` 
            ADD INDEX `idx_enrollment_status` (`enrollment_status`)
        """)
        
        print("Successfully added enrollment_status column")
        
    except Error as e:
        print(f"Error running migration: {e}")
        raise

def insert_interns(cursor, cohort_id=2):
    """Insert Cycle 58 interns"""
    # Password hash for: password123!
    password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
    
    user_ids = {}
    for name, email, enrollment_status in INTERNS:
        try:
            # Check if user already exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            existing = cursor.fetchone()
            
            if existing:
                print(f"User {name} already exists, skipping...")
                user_ids[email] = existing[0]
                continue
            
            cursor.execute("""
                INSERT INTO users (name, email, password_hash, role, current_cohort_id, status, enrollment_status)
                VALUES (%s, %s, %s, 'intern', %s, 'active', %s)
            """, (name, email, password_hash, cohort_id, enrollment_status))
            
            user_ids[email] = cursor.lastrowid
            print(f"Created user: {name} ({enrollment_status})")
        except Error as e:
            print(f"Error creating user {name}: {e}")
    
    return user_ids

def enroll_in_cohort(cursor, user_ids, cohort_id=2):
    """Enroll users in Cycle 58"""
    for email, user_id in user_ids.items():
        try:
            # Check if already enrolled
            cursor.execute("""
                SELECT id FROM cohort_memberships 
                WHERE user_id = %s AND cohort_id = %s
            """, (user_id, cohort_id))
            
            if cursor.fetchone():
                print(f"User {email} already enrolled in cohort")
                continue
            
            cursor.execute("""
                INSERT INTO cohort_memberships (user_id, cohort_id, joined_at)
                VALUES (%s, %s, '2025-08-01 09:00:00')
            """, (user_id, cohort_id))
            
            print(f"Enrolled {email} in Cycle 58")
        except Error as e:
            print(f"Error enrolling {email}: {e}")

def create_assessment_windows(cursor, cohort_id=2):
    """Create assessment windows for Cycle 58"""
    windows = [
        (1, cohort_id, 1, '2025-09-15 09:00:00', '2025-09-15 12:00:00', 1, 'Assessment A - Completed'),
        (2, cohort_id, 1, '2025-10-20 09:00:00', '2025-10-20 12:00:00', 1, 'Assessment B - Completed'),
        (3, cohort_id, 1, '2025-11-18 09:00:00', '2025-11-18 13:00:00', 1, 'Assessment C - Completed'),
        (4, cohort_id, 1, '2025-12-16 09:00:00', '2025-12-16 13:00:00', 1, 'Assessment D - Completed'),
    ]
    
    for assessment_id, cid, visible, opens, closes, locked, notes in windows:
        try:
            # Check if window already exists
            cursor.execute("""
                SELECT id FROM assessment_windows 
                WHERE assessment_id = %s AND cohort_id = %s
            """, (assessment_id, cid))
            
            if cursor.fetchone():
                print(f"Assessment window for Assessment {chr(64+assessment_id)} already exists")
                continue
            
            cursor.execute("""
                INSERT INTO assessment_windows 
                (assessment_id, cohort_id, visible, opens_at, closes_at, locked, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (assessment_id, cid, visible, opens, closes, locked, notes))
            
            print(f"Created assessment window for Assessment {chr(64+assessment_id)}")
        except Error as e:
            print(f"Error creating assessment window: {e}")

def insert_scores(cursor, user_ids, facilitator_id=2, cohort_id=2):
    """Insert all assessment scores"""
    assessment_dates = {
        'A': ('2025-09-15', 1),
        'B': ('2025-10-20', 2),
        'C': ('2025-11-18', 3),
        'D': ('2025-12-16', 4)
    }
    
    for email, user_id in user_ids.items():
        if email not in SCORES:
            continue
        
        for assessment_code, scores in SCORES[email].items():
            if not scores:  # Skip if no scores (dismissed/resigned)
                continue
            
            date_str, assessment_id = assessment_dates[assessment_code]
            task_ids = ASSESSMENT_TASKS[assessment_id]
            
            for idx, score in enumerate(scores):
                if idx >= len(task_ids):
                    break
                
                task_id = task_ids[idx]
                
                try:
                    # Create submission
                    cursor.execute("""
                        INSERT INTO submissions 
                        (user_id, cohort_id, assessment_id, task_id, status, started_at, submitted_at)
                        VALUES (%s, %s, %s, %s, 'submitted', %s, %s)
                    """, (
                        user_id, cohort_id, assessment_id, task_id, 
                        f'{date_str} 09:00:00', f'{date_str} 10:30:00'
                    ))
                    
                    submission_id = cursor.lastrowid
                    
                    # Create score
                    cursor.execute("""
                        INSERT INTO scores 
                        (submission_id, rubric_score, scored_by, scored_at)
                        VALUES (%s, %s, %s, %s)
                    """, (submission_id, score, facilitator_id, f'{date_str} 15:00:00'))
                    
                except Error as e:
                    print(f"Error inserting score for {email} Assessment {assessment_code} Task {idx+1}: {e}")
            
            print(f"Inserted scores for {email} - Assessment {assessment_code}")

def main():
    """Main execution"""
    connection = get_db_connection()
    if not connection:
        return
    
    try:
        cursor = connection.cursor()
        
        print("\n=== Starting Cycle 58 Data Seed ===\n")
        
        # Step 0: Run enrollment_status migration
        print("Step 0: Checking/running enrollment_status migration...")
        run_enrollment_status_migration(cursor)
        connection.commit()
        
        # Step 1: Insert interns
        print("\nStep 1: Creating intern accounts...")
        user_ids = insert_interns(cursor, cohort_id=2)
        connection.commit()
        
        # Step 2: Enroll in cohort
        print("\nStep 2: Enrolling interns in Cycle 58...")
        enroll_in_cohort(cursor, user_ids, cohort_id=2)
        connection.commit()
        
        # Step 3: Create assessment windows
        print("\nStep 3: Creating assessment windows...")
        create_assessment_windows(cursor, cohort_id=2)
        connection.commit()
        
        # Step 4: Insert scores
        print("\nStep 4: Inserting assessment scores...")
        insert_scores(cursor, user_ids, facilitator_id=2, cohort_id=2)
        connection.commit()
        
        print("\n=== Cycle 58 Data Seed Complete! ===")
        print(f"Total interns created: {len(user_ids)}")
        
    except Error as e:
        print(f"Error during seed process: {e}")
        connection.rollback()
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("\nDatabase connection closed.")

if __name__ == "__main__":
    main()
