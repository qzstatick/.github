---
name: analyze-plan-and-create-issues
description: "Analyze implementation plans and create GitHub issues for tracking work. Use when: converting IMPLEMENTATION_PLAN.md to issues, breaking down phases into tracked work items, syncing plan changes to issues, creating milestone-based issue structures."
argument-hint: "Optionally specify granularity level (phase/task/item), filter by phase name, or provide custom assignee mapping"
---

# Analyze Implementation Plan & Create Issues

Convert a structured implementation plan into GitHub issues with automatic organization, dependency tracking, and milestone linkage.

## Purpose

This skill helps transform multi-phase project plans into actionable GitHub issues, enabling:
- Automatic extraction of phases, tasks, and deliverables from markdown plans
- Flexible granularity: track by phase, by task, or by individual checkbox items
- Dependency analysis and validation
- Milestone creation linked to phases
- Issue templates with code blocks, checklists, and structured metadata
- Optional team member assignment with role mapping

## When to Use

- You have an `IMPLEMENTATION_PLAN.md` or similar structured plan document
- You want to convert plan items into GitHub issues for project tracking
- You need to organize issues by phases/milestones
- You want to maintain synchronization between a plan document and GitHub issues
- You need to track task dependencies and generate issue templates
- Your team prefers centralized issue tracking but maintains a detailed plan document

## Procedure

### 1. Analyze the Implementation Plan

First, gather details about the plan:

1. **Locate the plan file**: Typically `IMPLEMENTATION_PLAN.md` in the repository root or `.github/` folder.
2. **Parse the structure**: Identify key sections:
   - **Phases**: Major work blocks (Phase 1, Phase 2, etc.)
   - **Tasks**: Subsections within phases (e.g., 1.1, 1.2)
   - **Deliverables**: Specific outcomes and checkboxes (`[ ]`, `- [ ]`)
   - **Success criteria**: Any `✅` or success checkpoints
   - **Dependencies**: References to other tasks or external blockers
3. **Extract metadata**:
   - Task descriptions and goals
   - Estimated effort or time references
   - Implementation notes and technical decisions
   - Required tools or libraries mentioned
   - Code snippets or configuration examples

### 2. Choose Granularity Level

If the user has not specified, ask which level they prefer:

```
🎯 Issue Granularity - Choose One:

A) PHASE-LEVEL (3-6 issues)
   - One issue per major phase
   - Best for: High-level tracking, simple projects
   - Example: "Phase 1: Core Modules Implementation"

B) TASK-LEVEL (10-30 issues)
   - One issue per numbered task (1.1, 1.2, 1.3, etc.)
   - Best for: Balanced tracking, medium-sized projects
   - Example: "1.1 - Create Directory Structure"

C) ITEM-LEVEL (25-100+ issues)
   - One issue per checkbox item
   - Best for: Granular tracking, complex projects, sprint planning
   - Example: "Add models.py to src/agents/projects/"
```

Use the level that matches the team's workflow and project size.

### 3. Extract and Validate Dependencies

Before creating issues:

1. **Identify blocking relationships**:
   - Tasks marked with "requires X" or "depends on Y"
   - Sequential ordering (Phase 1 before Phase 2)
   - References to external tasks or issues

2. **Document dependency graph**:
   - Map each task/item to its dependencies
   - Flag circular dependencies (should not occur)
   - Note optional vs. mandatory dependencies

3. **Prepare for issue linking**:
   - Store dependency data for "Links" section in issues
   - Plan which tasks should be in same milestone

### 4. Configure Issue Metadata

Gather assignment and organization details:

1. **Team member mapping** (if available):
   - Ask user for role-to-username mapping:
     - `core_dev`: developer names for Core modules
     - `test_lead`: who owns testing tasks
     - `docs`: documentation owner
     - `infra`: infrastructure/setup tasks

2. **Milestone mapping**:
   - Usually one milestone per phase
   - Format: `Phase N - Title` (e.g., "Phase 1 - Infrastructure")

3. **Labels**:
   - Assign labels by category:
     - `type:setup`, `type:core`, `type:testing`, `type:docs`
     - `priority:high`, `priority:medium`, `priority:low`
     - `status:ready`, `status:blocked`, `status:epic`

### 5. Prepare Issue Templates

For each issue, structure the body as:

```markdown
## Description
[One-liner summary of the task]

[Detailed description from the plan]

## Objectives
- [ ] Objective 1
- [ ] Objective 2

## Deliverables
- [ ] Deliverable 1 (with file path if applicable)
- [ ] Deliverable 2

## Implementation Notes
[Technical notes, code snippets, or configuration from the plan]

## Dependencies
- Blocks: [#123, #456] (if this must complete before others)
- Blocked By: [#789] (if blocked by another task)
- Related: [#999] (informational links)

## Acceptance Criteria
- [ ] Code follows project conventions
- [ ] Tests pass with >80% coverage (if applicable)
- [ ] Documentation updated
- [ ] PR reviewed and approved
```

### 6. Create Issues in Batch

Execute the issue creation workflow:

1. **Group issues**:
   - By phase (if phase-level granularity)
   - By task category (core, tests, docs, examples)

2. **Call GitHub API** to create issues:
   - Use `github-pull-request_create_pull_request` or GitHub CLI (`gh issue create`) for each issue
   - Include milestone reference in issue body or via milestone flag
   - Set assignee if team mapping is available
   - Apply labels for categorization and priority

3. **Link issues**:
   - After creation, update "Dependencies" section with created issue numbers
   - Create related-issue links for cross-references

### 7. Create/Update Milestones

If phases should map to milestones:

1. **Create milestone per phase** (if not existing):
   - Title: `Phase N - Phase Name`
   - Description: Phase goal/summary
   - Due date: Optional, derived from plan timeline if mentioned

2. **Assign issues to milestones**:
   - All tasks in Phase N → Milestone "Phase N"
   - Update issue milestone field after creation

### 8. Verify and Report

After creation:

1. **Validate**:
   - All issues created successfully
   - Dependencies correctly linked
   - Milestones assigned
   - Labels applied consistently
   - Assignments correct

2. **Generate summary report**:
   ```
   ✅ Created N issues from [plan-name]
   
   📊 Breakdown:
   - Phase 1: X issues
   - Phase 2: Y issues
   - Phase 3: Z issues
   
   🔗 Dependencies: M linked
   🏷️  Labels: Applied to all issues
   👥 Assignments: N team members assigned
   🎯 Milestones: M milestones created
   
   📝 Next steps:
   - Review issues in [repo link]/issues
   - Adjust priorities or assignments as needed
   - Update plan when tasks are marked complete
   ```

3. **Provide issue board link**: 
   - Link to `/issues` filtered by milestone or label
   - Example: `[View Phase 1 Issues](https://github.com/owner/repo/issues?q=milestone:"Phase 1")`

## Best Practices

### Plan Structure Guidelines

Write implementation plans following this structure for best parsing:

```markdown
# Plan Title

## Overview
[What this plan achieves]

---

## Phase 1: Phase Name

### 1.1 Task Name

[Task description]

**Deliverables:**
- [ ] Specific item 1
- [ ] Specific item 2

**Implementation Notes:**
[Technical details, code snippets]

### 1.2 Another Task

[Continues...]
```

### Issue Naming Conventions

- **Phase-level**: `Phase N: Main Goal - Subgoal`
- **Task-level**: `N.M - Task Name`
- **Item-level**: `[Phase N] Deliverable - Specific item`

### Dependency Declarations

In the plan, indicate dependencies with:

```markdown
### 1.3 Task with Dependencies

**Prerequisites:**
- Requires: Section 1.1, Section 1.2
- Blocks: Section 1.4

[Rest of task description]
```

### Assignment Guidance

For role-based assignment, define mappings:

```
ASSIGNMENT MAP:
- Backend: @alice, @bob
- Frontend: @carol, @dave
- Testing: @eve
- Docs: @frank
- Infra: @grace
```

### Milestone Planning

Keep milestones aligned with phases:
- One milestone per phase
- Include phase number in milestone title
- Set due dates if timeline is known
- Archive milestones when phase completes

## Tips

1. **Dry run first**: Ask to preview generated issues before creating them, especially for the first few.

2. **Batch creation order**: Create parent/blocking issues first, then dependent tasks. This ensures issue numbers are available for linking.

3. **Template consistency**: Generate templates with consistent structure across all granularity levels—makes updating easier later.

4. **Plan-to-Issue sync**: When the plan updates, re-analyze and update issues. Keep them in sync via this skill or manual updates.

5. **Testing the plan**: Before converting to issues, validate the plan has no circular dependencies and all deliverables are named clearly.

6. **Epic tracking**: If phase-level granularity, consider creating an Epic issue for each phase that links all task issues.

7. **Labeling strategy**: Use consistent label names across all issues. Consider using label prefixes:
   - `type:*` for task category
   - `priority:*` for urgency
   - `status:*` for current state

## Example: Converting IMPLEMENTATION_PLAN.md

**Input**: [IMPLEMENTATION_PLAN.md](../../../IMPLEMENTATION_PLAN.md)

**Granularity chosen**: Task-level (one issue per numbered section)

**Output Example**:

```
✅ Created 6 issues

Issues created:
- #45: Phase 1: Setup - Create project directory structure
- #46: Phase 1: Setup - Update pyproject.toml with dependencies  
- #47: Phase 2: Core - Implement models.py
- #48: Phase 2: Core - Implement graphql_client.py
- #49: Phase 3: Testing - Write unit tests
- #50: Phase 4: Docs - Create comprehensive docstrings

🎯 Milestones:
- Created "Phase 1 - Infrastructure"
- Created "Phase 2 - Core Implementation"

🔗 Dependencies linked:
- #47 depends on #46
- #48 depends on #46
- #49 depends on #47, #48

👥 Assignments:
- Backend developer: #47, #48
- Test lead: #49
- Documentation: #50
```

## Integration with Workflow

1. **During planning**: Maintain plan in `IMPLEMENTATION_PLAN.md`
2. **Kickoff**: Use this skill to generate initial issues
3. **Updates**: Re-run skill when plan structure changes
4. **Closure**: Close corresponding issues as plan items complete
5. **Retrospective**: Analyze time estimates vs. actual (stored in issue comments) to improve future plans

---

## Advanced: Custom Processing

For plans with non-standard formats or complex structures, the skill can:

- Parse lists with indentation depth for hierarchy
- Extract code blocks as implementation guides
- Identify blockquotes as important notes
- Convert tables into issue acceptance criteria
- Parse inline dates as issue due dates
- Extract GitHub usernames (@mention) for assignments