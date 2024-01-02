import ply.lex as lex

# List of token names
tokens = (
    'KEYWORD',
    'ID',
    'NUMBER',
    'STRING',
    'REL_OP',
    'ASSIGN',
    'SEMICOLON',
    'LBRACE',
    'RBRACE',
    'RBRACKET',
    'LBRACKET',
    'LPAREN',
    'RPAREN',
    'PLUS',
    'MINUS',
    'TIMES',
    'DIVIDE',
    'MOD',
    'AND',
    'OR',
    'NOT',
    'XOR',
    'EQUALITY',
    'BITWISE_AND',
)

# Regular expression rules for token patterns
t_REL_OP = r'<=?|>=?|!=|>'
t_ASSIGN = r'='
t_SEMICOLON = r';'
t_LBRACE = r'{'
t_RBRACE = r'}'
t_RBRACKET = r'\['
t_LBRACKET = r'\]'
t_LPAREN = r'\('
t_RPAREN = r'\)'
t_PLUS = r'\+'
t_MINUS = r'-'
t_TIMES = r'\*'
t_DIVIDE = r'/'
t_MOD = r'%'
t_AND = r'&&'
t_OR = r'\|\|'
t_NOT = r'!'
t_XOR = r'\^'
t_EQUALITY = r'=='
t_BITWISE_AND = r'&'

# Rule for identifying keywords and IDs
def t_ID(t):
    r'[a-zA-Z_]\w*'
    keywords = {
        'if', 'else', 'for', 'while', 'int', 'str', 'float', 'double', 'auto', 'enum',
        'extern', 'protected', 'typedef', 'const', 'continue', 'default', 'switch', 'case',
        'short', 'signed', 'delete', 'do', 'long', 'struct', 'static', 'void', 'virtual',
        'sizeof', 'return', 'throw', 'public', 'private', 'this', 'break', 'class', 'char',
        'template', 'asm', 'inline', 'volatile', 'unsigned', 'try', 'catch', 'cout', 'cin',
        'include', 'std', 'endl', 'main', 'iostream'
    }
    if t.value in keywords:
        t.type = 'KEYWORD'
    else:
        t.type = 'ID'
    return t

# Rule for identifying numbers
def t_NUMBER(t):
    r'\d+'
    t.value = int(t.value)
    return t

# Rule for identifying string literals
def t_STRING(t):
    r'"[^"]*"'
    t.value = t.value[1:-1]  # Strip the quotation marks from the value
    return t

# Ignored characters
t_ignore = ' \t'

# Error handling rule
def t_error(t):
    print("Unknown token: {}".format(t.value[0]))
    t.lexer.skip(1)


# Build the lexer
lexer = lex.lex()

# Prompt user to enter the input text
input_text = input("Please enter the text containing symbols: ")

# Execute lexer on the input text
lexer.input(input_text)

# Print the tokens
while True:
    tok = lexer.token()
    if not tok:
        break  # No more input
    print("{} -> {}\n===========".format(tok.type, tok.value))
