# bf-link
A brainf*ck linker and minifier

## Installing

You can install this module for use on the command line by running:
```bash
npm install -g bf-link
```

Alternatively, you can use bf-link in your module by running this command:
```bash
npm install -s bf-link
```

## Usage
```bash
bf-link -i <infile> -o <outfile> -l <library location>
```

## Introduction

A brainf*ck file can link other files in a variety of ways.

Project modules refer to another unlinked (or linked) file that can reside anywhere on your file system, but require a relative or absolute path to each one.

Project packages refer to pre-linked singular files that reside within a particular folder that you can specify during compile time.

You'd typically use project modules for project specific files (such as a constants file). On the other hand, you'd use pre-linked project modules when you repeatedly use a file (such as a cell swapping file).

## Command line usage

Firstly, you can view the help page built into the linker at any time by running:
```bash
bf-link -h
```

Now for an example, say you had a project structure of:
```
myProject/
├-- main.b
├-- const.b
├-- const1.b
├-- const2.b
└-- lib/
    └-- add.b
```
Where
* `main.b` is the main entry file (i.e. nothing else depends on it in the project)
* `const.b` brings together the constants, and sets them
* `const1.b` is a file which moves along one cell, and adds 7
* `const2.b` is a file which moves along one cell, and adds 5
* `lib/add.b` is a pre-linked and minified file which adds two cells together

So let's start by creating the `const1.b` and `const2.b`, as we need no extra knowledge of this.

#### const1.b
```
move along one cell
>
add 7 to the cell
+++++++
```

#### const2.b
```
move along one cell
>
add 5 to the cell
+++++
```

Great! Now we need to include the project modules `const1.b` and `const2.b` in the `const.b` file, which will set the cells that we need.

We can link a file by using the syntax `{{absolute/or/relative/path/to/file.b}}`. This will get replaced by the linker with the actual file contents, and then get minified after.

#### const.b
```
this will get replaced by the contents of const1
{{const1.b}}

this will get replaced by the contents of const2
{{const2.b}}

and we want to move back two cells to get back to the 0th cell
<<
```

So therefore, after linking this file will become:
```
move along one cell
>
add 7 to the cell
+++++++

move along one cell
>
add 5 to the cell
+++++

and we want to move back two cells to get back to the 0th cell
<<
```

Awesome! We want to then set these constants in our entry file, so let's import the `const.b` file into the `main.b` file. In this example, we don't include the file extension, as it isn't strictly necessary.

#### main.b
```
{{const}}
```

Now that we have that sorted, we want to import our add package, which does not depend on anything (either it doesn't import anything, or it has been pre-linked).

The syntax for this uses `((libraryname))`. In our example, we can import it by using `((add))`, like this:

#### main.b
```
{{const}}
((add))
```

### Building our project
Now we've got all of the files set up, we can build our project. Our entry point is `main.b`, we want our linked and minified file to be saved as `out.b`, and our library folder is at `lib/`. Therefore, we can run this command in our project directory to build it:
```bash
bf-link -i main.b -o out.b -l lib
```

## TODOs
* Talk about the node API for linking files
* Make the documentation better/clearer
* Write unit tests
