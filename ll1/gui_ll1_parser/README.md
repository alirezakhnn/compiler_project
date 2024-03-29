# LL1 Parser

Desktop app for visualizing parse tree , abstract syntax tree , action table , parse table for any valid LL1 grammar.

## Example
![initial state](https://github.com/Ahmed712441/LL1-parser/blob/master/images/initial.PNG)
![parsing tree](https://github.com/Ahmed712441/LL1-parser/blob/master/images/parsingtree.PNG)
![abstract tree](https://github.com/Ahmed712441/LL1-parser/blob/master/images/abstractTree.PNG)
![action table](https://github.com/Ahmed712441/LL1-parser/blob/master/images/actiontable.PNG)
![parse table](https://github.com/Ahmed712441/LL1-parser/blob/master/images/parse_table.PNG)

### Grammar
```
Exp --> Term Exp`
Exp` --> Addop Term Exp` | Epsilon
Addop --> + | -
Term --> Factor Term`
Term` --> Mullop Factor Term` | Epsilon
Mullop --> * | /
Factor --> ID | NUM | ( Exp )
```
### Parse Table
parse table for this grammar
![parse table](https://github.com/Ahmed712441/LL1-parser/blob/master/images/parse_table.PNG)

### Implementation
guide for implementing your own grammar

#### Rules implementation
```
in parsers/grammar.py

in this file you add your rules as classes which inherits from  TreeNode (responsible for drawing tree) , and Rule (responsible for generating new rules when this rule takes an input or raise error when the rule can't process the input)
 
this exp` implementation example:

class ExpDash(TreeNode,Rule):

    def __init__(self, treecanvas, level, parent, left, right,):
        rules = dict() # dictionary acts like the row of this rule in parse table(maps each item to its corresponding genearated rule)
        rules['+'] = [Addop,Term,ExpDash]  # corresponds to + entry for exp' in parse table 
        rules['-'] = [Addop,Term,ExpDash] # corresponds to - entry for exp' in parse table
        rules[')'] = [EpsilonTerminal]  # corresponds to ) entry for exp' in parse table
        rules['$'] = [EpsilonTerminal]  # corresponds to $ entry for exp' in parse table
        TreeNode.__init__(self,treecanvas,level,parent,left, right, None,'Exp\'', False) 
        Rule.__init__(self,rule_name= 'Exp\'',rules=rules) # rule_name is for action table

repeat this process for other rules
```
#### Terminals implementation
```
in parsers/terminals.py

in this file you add your terminals as classes which inherits from  TreeNode (responsible for drawing tree) , specify for them pirority if they will partcipate in abstract tree pirority is reversed (ex: + = 2 , * = 1)
 
this plusTerminal , identifier implementation example:

class plusTerminal(TreeNode):
    def __init__(self, treecanvas, level, parent, left, right,):
        super().__init__(treecanvas,level,parent,left, right, None,'+', True)
        self.pirority = 2 
    
class IDTerminal(TreeNode):
    def __init__(self, treecanvas, level, parent, left, right,):
        super().__init__(treecanvas,level,parent,left, right, None,'id', True)
        self.pirority = 0
    
    def __repr__(self) -> str:
        return 'id'

repeat this process for other terminals
```
#### Parser implementation
```
in parsers/parser.py
you need to define this tuple
SPLIT_TERMINALS = ('+' , '-' , '*' , '/' , ')' , '(') # tuple which is used to genarate your tokens (split by charachters)

example: input = 'num10+num20-11' and SPLIT_TERMINALS = ('+' , '-')
tokens = ['num10','+','num20','-','11']
for more details about implementation you can take a look at Parser.__parse_input() function which is responsible for generating tokens
```
#### Abstract Syntax Analyzer implementation
```
in parsers/abstract.py
you need to define this three tuples in AbstractSyntaxAnalyzer class according to your grammar
TERMINALS = (IDTerminal,NumTerminal,plusTerminal,minusTerminal,multiplyTerminal,divisionTerminal) # Terminals which will participate in abstract tree
SEPARATOR = (leftBracketTerminal) # Terminal in which when found start new list of tokens which is treated as single element in old token ex: 2*(3*3) this will make your list = [2,*,[3,*,3]] instead of list = [2,*,3,*,3]
TERMINATOR = (rightBracketTerminal) # Terminal in which End the separtor created list right bracket in my case
```
#### Parse Table Visualization
```
in GUI/table.py
define this two list

TERMINALS = [plusTerminal,minusTerminal,leftBracketTerminal,rightBracketTerminal,multiplyTerminal,divisionTerminal,dollarTerminal,IDTerminal,NumTerminal] # list contains all your terminals classes

RULES = [Exp,ExpDash,Addop,Mullop,Factor,Term,TermDash] # list contains all your rules classes
```
#### Changes you may need
```
in main.py
line 30
define your parser using your start rule
in my example it's EXP (Start rule class) :
self.__parser =  Parser(self.canvas.canvas,Exp)
```
## Dependencies
```
tk==0.1.0
```


The project appears to be a graphical user interface (GUI) for a parser. It contains multiple files that work together to provide a user interface for parsing input strings.

main.py:

This file contains the main application code. It imports various modules and creates a Tkinter window to display the GUI.
It defines a class Main that extends the Tkinter Frame class. This class represents the main application window and contains various UI elements, such as labels, buttons, and canvas widgets.
The Main class has methods to handle user interactions, such as submitting a string, showing action table, showing parse tree, etc.
The if __name__ == "__main__": block creates an instance of the Main class and starts the Tkinter event loop to run the application.
./parsers/abstract.py:

This file contains a class TempNode and a class AbstractSyntaxAnalyzer.
The TempNode class represents a temporary node used in constructing an abstract tree visualization.
The AbstractSyntaxAnalyzer class is responsible for generating and drawing the abstract syntax tree based on a list of terminals.
./parsers/grammar.py:

This file defines various classes that represent grammar rules, such as Rule, Exp, ExpDash, Addop, Mullop, Factor, Term, and TermDash.
Each class extends the TreeNode class and has its own set of rules for parsing input tokens.
./parsers/parser.py:

This file contains the Parser class that performs the parsing of input strings based on a given grammar and action table.
The Parser class has a parse method that takes an input string and an action table and uses a stack-based parsing algorithm to parse the input string.
Overall, the project's main goal is to provide a GUI for parsing input strings using a specific grammar and visualize the parsing process using tree structures.
