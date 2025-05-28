27 May

- set up a git repo
- add stores for various things

- control everything via "watch" in mainpanel

- stores can have methods in them that do things, eg print out all of the questions ...

# TODO

Ionic Q = 0 - 127
Covalent = 128 + 256 -> 511
Question type = 512 + 1024

Do I need to split this out somehow?
Let's assume for now that I'll just use one variable.

---

- All ions are loaded from ions.dat and I can get a random ion of any type.

NEXT STEP:

setup the question panel.

state=CREATE_QUESTION
create the formula from the two ions and the charges
//search through ions.dat to see if the formula exists (in covalent complex) before simplification. If it does, do not simplify it.

# Security and access control

1. make the full version available only on Friday, unless you have a login
2. the limited version would not only do simple ionic and complex covalent
3. each school gets a userCode (3random words strung together)

## Possible Pricing Structure

$10/student / year
1 class = 25+ students = $250.
Multi class discount (per school) = each class is $200

School board discount (min. 3 schools)

- assume 3 classes per school: licence per school = $600
  x number of schools

  - 10%

  So 3 schools would be $1800 -10% = $1620
  So 5 schools would be $3000 -10% = $2700
