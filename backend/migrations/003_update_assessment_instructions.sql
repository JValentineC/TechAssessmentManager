-- ============================================================
-- Update Assessment Tasks with Official i.c.stars Instructions
-- Based on Tech Foundations Performance Assessment Guide
-- ============================================================

-- ============================================================
-- ASSESSMENT A (Week 3) - Digital Collaboration, Systems Setup, Cybersecurity
-- ============================================================

-- First, delete the incorrect tasks for Assessment A
DELETE FROM tasks WHERE assessment_id = 1;

-- Insert correct Assessment A tasks
INSERT INTO `tasks` (`assessment_id`, `title`, `instructions`, `template_url`, `max_points`, `order_index`) VALUES
(1, 'Shared Doc Collaboration', 
'**Standards:** DC.SK1 - Use shared platforms (Docs, Sheets) to co-edit files. DC.SK2 - Apply commenting and permissions to manage collaboration.

**Instructions:**
Add two sentences to the provided paragraph in the shared Google Doc, add at least two comments, then change permissions so your peer can edit. Finally, add a simple README to the folder with Purpose, Owner, and How to Contribute.

**What to Submit:**
Upload a screenshot or PDF showing:
- Your edits to the document
- At least 2 constructive comments you added
- Updated permissions (showing peer can edit)
- The README file you created in the folder

**Proficient Performance:**
- Correctly edits the document
- Leaves 2+ constructive comments
- Adjusts permissions to allow peer editing  
- File is placed in a correctly named shared folder with README', 
NULL, 5, 1),

(1, 'IDE & Git Setup Verification', 
'**Standards:** SE.SK1 - Install and configure IDE and CLI tools. SE.SK2 - Connect local environment to Git repositories. SE.SK3 - Verify environment functionality. SD.SK3 - Clone, branch, commit, push using Git.

**Instructions:**
Clone the provided starter GitHub repo, make a small change, commit with a meaningful message, and push to GitHub. Aim for at least two commits following the scaffold → feature pattern.

**GitHub Repo:** [Your facilitator will provide the starter repo URL]

**What to Submit:**
Upload a screenshot or document showing:
- Your IDE open with the project structure visible
- Terminal showing git log with at least 2 commits
- GitHub repo page showing your pushed commits with meaningful messages (not "test" or "update")

**Proficient Performance:**
- IDE open with project structure visible
- Repo initialized and connected to GitHub
- At least 2 commits with meaningful messages
- Push verified on GitHub', 
NULL, 5, 2),

(1, 'Cybersecurity Checklist', 
'**Standards:** CY.SK1 - Identify risks of weak passwords and unprotected accounts. CY.SK2 - Apply strong passwords, MFA, and secure storage. CY.SK3 - Build a personal security checklist.

**Instructions:**
Complete the provided cybersecurity checklist with at least three secure practices you use or plan to adopt. Include one personal risk and how you will mitigate it.

**Security Practices to Consider:**
- Strong password manager usage
- Multi-factor authentication (MFA) enabled on critical accounts
- Regular device/software updates
- VPN usage on public networks
- Secure repository practices (.env for secrets)

**What to Submit:**
Upload a completed checklist document (.txt, .md, or .pdf) containing:
- At least 3 specific security practices you use/will adopt
- One personal cybersecurity risk you have identified
- Your mitigation plan for that risk

**Proficient Performance:**
- Lists 3+ practices (MFA, password manager, updates)
- Identifies 1 personal risk with specific mitigation
- Shows understanding of secure digital hygiene', 
NULL, 5, 3),

(1, 'Reflection', 
'**Required Micro-Notes (Not Scored)**

After completing the assessments, write a short reflection addressing these questions:

1. What worked well for you during this assessment?
2. What could you improve next time?
3. What professional habit will you keep practicing?

**What to Submit:**
Upload a short reflection document (.txt or .md) with your responses to the three questions above.

This reflection helps you build metacognition and helps facilitators understand how to support your growth.', 
NULL, 0, 4);

-- ============================================================
-- ASSESSMENT B (Week 6) - Agile, SDLC, Quality Assurance
-- ============================================================

DELETE FROM tasks WHERE assessment_id = 2;

INSERT INTO `tasks` (`assessment_id`, `title`, `instructions`, `template_url`, `max_points`, `order_index`) VALUES
(2, 'Agile Backlog Refinement', 
'**Standards:** AG.SK2 - Break down user stories into tasks with estimates. AG.SK3 - Refine backlog into sprint-ready format. AG.SK5 - Refine backlog tasks with estimates/owners.

**Instructions:**
Take 4-5 rough user stories provided by your facilitator. Rewrite them in the "As a [role], I want [goal], so that [reason]" format with a clear story title. Then break each story down into at least two tasks, add estimates, and assign an owner.

**Example Story Format:**
**Title:** User Authentication
**Story:** As a registered user, I want to log in with my email and password, so that I can access my personalized dashboard.
**Acceptance Criteria:**
- Email validation required
- Password must meet security requirements
- Error messages display for invalid credentials
**Tasks:**
- Design login form UI (2 hours, Designer)
- Implement authentication API endpoint (4 hours, Backend Dev)
**Estimate:** 6 hours total

**What to Submit:**
Upload a document (.txt, .md, or .pdf) containing your refined backlog with 4-5 sprint-ready stories.

**Proficient Performance:**
- Stories rewritten clearly with acceptance criteria
- At least 4-5 stories refined
- Each story has 2+ tasks with owners and estimates
- Format follows Agile best practices', 
NULL, 5, 1),

(2, 'SDLC Diagram', 
'**Standards:** SD.KU1 - Understanding lifecycle phases enables reliable collaboration. SD.SK1 - Identify and explain SDLC phases. SD.SK2 - Compare Waterfall and Agile approaches.

**Instructions:**
Create a diagram mapping out the phases of the Software Development Lifecycle (SDLC). Show where Agile and Waterfall methodologies differ. Add one note about how your current team project reflects Agile practices.

**SDLC Phases to Include:**
1. Requirements Gathering
2. Design
3. Implementation/Development
4. Testing
5. Deployment
6. Maintenance

**What to Submit:**
Upload a diagram (PNG, JPG, PDF, or .drawio) showing the SDLC phases with annotations explaining Agile vs. Waterfall differences and a connection to your real project.

**Proficient Performance:**
- Identifies 5+ phases in correct order
- Clearly distinguishes Agile vs. Waterfall
- Connects to team\'s actual project context
- Visual is clear and organized', 
NULL, 5, 2),

(2, 'Test Plan + Defect Log', 
'**Standards:** QA.SK1 - Translate requirements into test cases. QA.SK2 - Log and track defects systematically.

**Instructions:**
Write 3 test cases for the following requirement using the Given/When/Then format:

**Requirement:** User can log in with email and password and see their dashboard.

Then log at least one defect based on a simulated error (e.g., "Login accepts wrong password").

**Test Case Format:**
**Test Case ID:** TC-001
**Given:** User is on the login page
**When:** User enters valid email and password and clicks "Login"
**Then:** User is redirected to dashboard and sees welcome message

**Defect Log Format:**
**Defect ID:** DEF-001
**Severity:** High
**Description:** Login accepts incorrect password
**Steps to Reproduce:** 1. Navigate to login, 2. Enter valid email with wrong password, 3. Click Login
**Expected:** Error message displayed
**Actual:** User logged in successfully
**Status:** Open

**What to Submit:**
Upload a document (.txt, .md, or .pdf) containing your test plan with 3 test cases and at least 1 logged defect.

**Proficient Performance:**
- 3+ test cases mapped to requirements
- Uses Given/When/Then format correctly
- Logs 1+ realistic defect with all required fields
- Shows discipline in test documentation', 
NULL, 5, 3),

(2, 'Reflection', 
'**Required Micro-Notes (Not Scored)**

After completing the assessments, write a short reflection addressing these questions:

1. What worked well for you during this assessment?
2. What could you improve next time?
3. What professional habit will you keep practicing?

**What to Submit:**
Upload a short reflection document (.txt or .md) with your responses.', 
NULL, 0, 4);

-- ============================================================
-- ASSESSMENT C (Week 9) - Programming, Data, APIs, Risk Management
-- ============================================================

DELETE FROM tasks WHERE assessment_id = 3;

INSERT INTO `tasks` (`assessment_id`, `title`, `instructions`, `template_url`, `max_points`, `order_index`) VALUES
(3, 'Write a Function', 
'**Standards:** PR.SK1 - Write variables, loops, and conditionals. PR.SK2 - Structure code for readability. PR.SK3 - Write and call reusable functions. PR.SK4 - Handle errors and debug systematically.

**Instructions:**
Write a function that takes a list of integers and returns a list of only the positive even numbers, doubled. Add at least one error-handling condition.

**Example:**
Input: [1, 2, -3, 4, 5, 6, -8, 10]
Output: [4, 8, 12, 20]

**Requirements:**
- Function must ignore negative numbers
- Function must double positive even numbers
- Include error handling (e.g., check if input is a list)
- Use clean variable names and readable structure
- Make at least 3 commits: scaffold → feature → refactor

**What to Submit:**
Upload your code file (.py, .js, or .txt) and include a screenshot of your GitHub repo showing at least 3 commits with meaningful messages.

**Proficient Performance:**
- Function runs correctly, ignores negatives, doubles positives
- Clean variable names, readable structure
- At least 3 commits (scaffold, feature, refactor) with meaningful messages
- Error handling present', 
NULL, 5, 1),

(3, 'SQL JOIN Query', 
'**Standards:** DA.SK1 - Describe tables, rows, and relationships. DA.SK2 - Write SELECT queries with filters. DA.SK3 - Write JOIN and GROUP BY queries.

**Instructions:**
Open your Northwind Database (same DB used for Geek Week). Write a query that shows each employee\'s first name and the number of orders they have placed. Group the results by employee\'s first name and order by number of orders descending.

**Expected Output Columns:**
- FirstName
- NumberOfOrders

**Requirements:**
- Use JOIN to connect Employees and Orders tables
- Use GROUP BY to aggregate by employee
- Use COUNT to get number of orders
- Order results by NumberOfOrders descending
- Include a brief explanation of your query in a comment or README

**What to Submit:**
Upload a .sql or .txt file containing:
- Your SQL query
- Brief explanation of what the query does and why you structured it that way

**Proficient Performance:**
- Correct JOIN + GROUP BY syntax
- Query retrieves required information accurately
- README note explains query purpose
- Results show employee names with their order counts', 
NULL, 5, 2),

(3, 'API Call Simulation', 
'**Standards:** API.SK1 - Call endpoints and parse JSON. API.SK2 - Handle rate limits and errors.

**Instructions:**
Call the provided mock API endpoint, parse the JSON response, and extract the field "title". Handle one simulated error (e.g., network failure). Store your API key in a .env file and add .env to your .gitignore.

**Provided Endpoint:**
[Your facilitator will provide the mock endpoint URL]

**Requirements:**
- Successfully call the endpoint
- Parse JSON response
- Extract the "title" field
- Add error handling (try/catch or if/else)
- Use .env file for API key (if required)
- Add .env to .gitignore
- Never commit secrets to your repo

**What to Submit:**
Upload your code file (.py, .js, or .txt) showing:
- API call implementation
- JSON parsing
- Error handling
- Screenshot of your .gitignore file showing .env is excluded

**Proficient Performance:**
- Calls endpoint and parses JSON successfully
- Extracts title field correctly
- Handles errors with friendly messages
- Secrets managed in .env + .gitignore
- No hard-coded credentials', 
NULL, 5, 3),

(3, 'Risk Register', 
'**Standards:** AG.SK4 - Rehearse roles and contingency plans. AG.SK5 - Refine backlog tasks with estimates/owners.

**Instructions:**
Create a risk register for your Sprint 2 demo. List at least three risks that could affect your presentation. For each risk, provide a specific mitigation strategy and assign an owner.

**Risk Register Format:**
| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| API goes down during demo | Medium | High | Prepare recorded video backup | Jane |

**Example Risks:**
- API outage during demo
- Missing data in database
- Team member absent
- Laptop/projector fails
- Internet connection drops

**Requirements:**
- Identify 3 clear, realistic risks
- Rate probability (Low/Medium/High) and impact (Low/Medium/High)
- Provide specific mitigation for each risk (not generic)
- Assign an owner to each mitigation
- Link risks to backlog issues in your repo (if applicable)

**What to Submit:**
Upload a document (.md, .txt, or .pdf) containing your completed risk register.

**Proficient Performance:**
- 3 clear risks identified with probability and impact
- Each has a specific mitigation strategy
- Owners assigned to all mitigations
- Risks are realistic and relevant to your project', 
NULL, 5, 4),

(3, 'Reflection', 
'**Required Micro-Notes (Not Scored)**

After completing the assessments, write a short reflection addressing these questions:

1. What worked well for you during this assessment?
2. What could you improve next time?
3. What professional habit will you keep practicing?

**What to Submit:**
Upload a short reflection document (.txt or .md) with your responses.', 
NULL, 0, 5);

-- ============================================================
-- ASSESSMENT D (Week 12) - Data Management, Modeling, AI, Release
-- ============================================================

DELETE FROM tasks WHERE assessment_id = 4;

INSERT INTO `tasks` (`assessment_id`, `title`, `instructions`, `template_url`, `max_points`, `order_index`) VALUES
(4, 'Data Pipeline Build', 
'**Standards:** DM.SK1 - Read and write CSV and JSON formats. DM.SK2 - Clean and summarize structured data.

**Instructions:**
Import the provided raw CSV (with deliberate issues: missing headers, mixed types, nulls, encoding errors). Clean the data so columns and data types make sense, then export both a cleaned CSV and a JSON version. Document what you cleaned and why.

**Your facilitator will provide:** raw.csv file with intentional data quality issues

**Requirements:**
- Create folder structure: /data/raw.csv → /data/clean.csv → /data/export.json
- Handle missing headers
- Normalize data types/dates
- Remove or flag nulls
- Produce valid JSON export
- Create /notes/data_cleaning_log.md documenting what/why/how
- Add logging for key steps (start, rows processed, anomalies found)
- Follow commit discipline: scaffold → feature → refactor
- Include README at repo root explaining how to run

**What to Submit:**
Upload a .zip file containing:
- Your cleaned CSV and JSON files
- Data cleaning log
- Runner script(s)
- README
- Screenshot of your commits

**Proficient Performance:**
- Builds full pipeline: CSV → cleaned CSV → JSON
- Cleaning log present with rationale
- Logging used for key steps
- Commits show scaffold → feature → refactor
- README explains how to run pipeline', 
NULL, 5, 1),

(4, 'ERD + Schema Design', 
'**Standards:** DM.SK3 - Create entity-relationship diagrams (ERDs). DM.SK4 - Translate models into SQL schemas.

**Instructions:**
Create an Entity-Relationship Diagram (ERD) for the following scenario: Users place orders that contain many products. Then write CREATE TABLE statements for at least three entities, including primary keys and foreign keys.

**Scenario Details:**
- Users can place multiple orders
- Orders contain multiple products (many-to-many relationship)
- Products have name, price, and category
- Orders have order date and total amount
- Order items link orders to products with quantity

**Requirements:**
- Create ERD showing entities, attributes, and relationships (1-to-many, many-to-many)
- Save as /design/erd.png (or .pdf/.drawio)
- Write CREATE TABLE statements in /sql/schema.sql
- Include PRIMARY KEY constraints
- Include FOREIGN KEY constraints
- Use appropriate data types (INT, VARCHAR, DECIMAL, DATE, etc.)
- Add NOT NULL constraints where appropriate
- Include brief comments explaining design choices

**What to Submit:**
Upload a .zip file containing:
- Your ERD diagram
- schema.sql file with CREATE TABLE statements
- Brief notes on design rationale

**Proficient Performance:**
- ERD has correct entities and relationships (1-to-many, many-to-many via join table)
- Valid SQL with PK/FK, appropriate types, NOT NULL constraints
- Brief comment mapping design choices to scenario
- Schema is normalized and follows best practices', 
NULL, 5, 2),

(4, 'AI Evaluation Task', 
'**Standards:** AI.SK3 - Integrate AI into workflows. AI.SK4 - Evaluate AI vs. baseline outputs.

**Instructions:**
Use AI (ChatGPT, Claude, or another LLM) to produce a summary of the provided dataset. Compare the AI output to the provided human baseline summary using at least two criteria. Decide: accept, edit, or reject the AI output, and explain why.

**Your facilitator will provide:**
- A dataset to analyze
- A human baseline summary

**Evaluation Criteria (choose at least 2):**
- Accuracy: Is the information correct?
- Completeness: Does it cover all key points?
- Bias/Privacy Risk: Does it make assumptions or expose sensitive data?
- Time Saved: How much faster was AI vs. manual work?

**Requirements:**
- Do NOT include PII (Personally Identifiable Information) in your prompts
- Note data provenance (where the data came from)
- Save AI output to /ai/ai_output.md
- Create /ai/evaluation_log.md with your comparison
- Make a clear decision: accept / edit / reject with rationale
- Explain which criteria you used and why

**What to Submit:**
Upload a .zip file containing:
- AI output file
- Evaluation log with comparison and decision
- Brief notes on data provenance

**Proficient Performance:**
- Evaluates against ≥2 criteria
- Identifies at least one gap or risk
- Makes clear accept/edit/reject decision with rationale
- Notes data provenance
- No PII in prompts', 
NULL, 5, 3),

(4, 'Release Plan', 
'**Standards:** RL.SK1 - Document deployment and rollback steps. RL.SK2 - Describe monitoring and incident response practices.

**Instructions:**
Write a release plan for deploying a simple system (API + Database + UI). Include pre-flight checks, step-by-step release instructions, rollback steps, and monitoring signals. Define roles and escalation procedures for incidents.

**System Context:**
You are deploying a web application with:
- Backend API (Node.js or PHP)
- Database (MySQL or PostgreSQL)  
- Frontend UI (React or HTML/CSS/JS)

**Release Plan Sections Required:**

1. **Pre-flight Checklist:**
   - All tests passing?
   - Database backup completed?
   - Rollback plan ready?
   - Team notified?

2. **Deployment Steps (ordered):**
   - Step 1: Back up production database
   - Step 2: Deploy backend code to staging
   - Step 3: Run database migrations
   - [Continue with specific steps...]

3. **Rollback Trigger:**
   - When do we rollback? (e.g., error rate > 5%, critical feature broken)

4. **Rollback Steps:**
   - Step 1: Revert database migration
   - Step 2: Redeploy previous backend version
   - [Continue with specific steps...]

5. **Monitoring Signals:**
   - Health check endpoint status
   - Error rate threshold (e.g., < 1%)
   - API latency target (e.g., < 500ms)
   - Database connection pool status

6. **Roles & Escalation:**
   - Who deploys? (e.g., DevOps Lead)
   - Who monitors? (e.g., On-call Engineer)
   - Who gets notified if issues arise? (e.g., Team Lead, CTO)
   - Escalation path and contact info

**What to Submit:**
Upload a .zip file containing:
- /ops/release_plan.md (all sections above)
- /ops/incident_log.md (template or simulated first entry)

**Proficient Performance:**
- Clear preflight checklist
- Ordered deployment steps
- Specific rollback trigger and steps
- Monitoring signals defined (health, error rate, latency)
- Roles and escalation clearly assigned
- Plan is realistic and actionable', 
NULL, 5, 4),

(4, 'Reflection', 
'**Required Micro-Notes (Not Scored)**

After completing the assessments, write a short reflection addressing these questions:

1. What worked well for you during this assessment?
2. What could you improve next time?
3. What professional habit will you keep practicing?

**What to Submit:**
Upload a short reflection document (.txt or .md) with your responses.', 
NULL, 0, 5);

-- ============================================================
-- Update Assessment Descriptions to Match Official Guide
-- ============================================================

UPDATE assessments 
SET description = 'Week 3 Performance Assessment: Evaluate foundational skills in Digital Collaboration, Systems Setup, and Cybersecurity. This checkpoint ensures interns can work in shared environments, configure development tools, and maintain secure digital hygiene before advancing to deeper technical work.'
WHERE code = 'A';

UPDATE assessments 
SET description = 'Week 6 Performance Assessment: Evaluate applied skills in Agile Foundations, SDLC understanding, and Quality Assurance practices. This checkpoint ensures interns can refine backlogs, understand software lifecycles, and apply systematic testing discipline for reliable delivery.'
WHERE code = 'B';

UPDATE assessments 
SET description = 'Week 9 Performance Assessment: Evaluate programming fundamentals, data querying, API integration, and risk management. This checkpoint ensures interns can write functions, query databases with JOINs, call APIs, and anticipate project risks before Sprint 2 delivery.'
WHERE code = 'C';

UPDATE assessments 
SET description = 'Week 12 Performance Assessment: Evaluate advanced data management, database modeling, AI evaluation, and release planning. This comprehensive checkpoint prepares interns for capstone delivery by demonstrating end-to-end system thinking: data pipelines, relational design, responsible AI use, and operational discipline.'
WHERE code = 'D';

-- ============================================================
-- Restore Assessment A duration to 60 minutes (from 1 minute test setting)
-- ============================================================

UPDATE assessments SET duration_minutes = 60 WHERE code = 'A';
