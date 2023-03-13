#   Managing tools
```
This project will be managing tools with functionality inherent in similar projects.
```

---

##  Functions:
```
1. Login and register
2. Profile edit
3. Project creation
4. Task creation
5. Task update
6. Task delete
7. Task moving into different phases (To do, in progress, completed)
8. Invite people into exists project
9. Add comments to existed tasks
```

---

##  Data models:
```
1. User Model
  - Id
  - Username
  - Email
  - Password
  - Avatar

2. Project Model
  - Id
  - Name
  - Description

3. Task Model
  - Id
  - Task
  - PhaseId

4. Phase Model
  - Id
  - Name

5. Comment
  - Id
  - UserId
  - TaskId

6. Project Inventation
  - Id
  - UserId
  - ProjectId
```
