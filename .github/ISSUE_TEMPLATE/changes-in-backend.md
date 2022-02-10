---
name: Changes in Backend
about: created for the purpose of warning changes that would impact the frontend.
title: "[BACKEND]"
labels: backend
assignees: ruanlinos

---

### Describe the Change:
A clear and concise description of what the change is.

e.g.  Changed Mutation register:

```graphql
# Before: the field is called username
mutation Register{
  Register(data: {
    username: "" # <- This.
    lastname: ""
  }) {
  email
  }
}
```

```graphql
# Now: the field is called Alien name:
mutation Register{
  Register(data: {
    alienname: "" # <- This.
    lastname: ""
  }) {
  email
  }
}
```

## A Link to Pull Request:

e.g. [PR 147 - Change username to alienname](http://www.stackoverflow.com)
