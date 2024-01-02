import re

# Regular expressions for ids, strings, keywords, and signs
keyword_patterns = [
    r'if',
    r'else',
    r'for',
    r'while',
    r'int',
    r'str',
    r'float',
    r'double',
    r'auto',
    r'enum',
    r'extern',
    r'protected',
    r'typedef',
    r'const',
    r'continue',
    r'default',
    r'switch',
    r'case',
    r'short',
    r'signed',
    r'delete',
    r'do',
    r'long',
    r'struct',
    r'static',
    r'void',
    r'virtual',
    r'sizeof',
    r'return',
    r'throw',
    r'public',
    r'private',
    r'this',
    r'break',
    r'class',
    r'char',
    r'template',
    r'asm',
    r'inline',
    r'volatile',
    r'unsigned',
    r'try',
    r'catch',
    r'cout',
    r'cin',
    r'include',
    r'std',
    r'endl',
    r'char',
    r'main',
    r'include',
    r'iostream'
    # Add more keywords as needed
]

sign_patterns = [
    r'\+',
    r'-',
    r'\*',
    r'/',
    r'%',
    r'==',
    r'!=',
    r'<=',
    r'>=',
    r'<',
    r'>',
    r'=',
    r',',
    r'&',
    r'#',
]

parenthesis_pattern = r'[()]'
brackets_pattern = r'[\[\]]'
braces_pattern = r'[{}]'

id_pattern = r'(?!(?:\b(?:{})))[a-zA-Z_]\w*\b'.format('|'.join(keyword_patterns))
str_pattern = r'"[^"]*"'
number_pattern = r"\d+"

all_patterns = '|'.join([
    number_pattern,
    id_pattern,
    str_pattern,
    *keyword_patterns,
    *sign_patterns,
    parenthesis_pattern,
    brackets_pattern,
    braces_pattern,
])

def cpp_code(code):
    scanner_pattern = re.compile(all_patterns)
    matches = scanner_pattern.findall(code)
    return matches

# Prompt the user to enter the input code
code = input("Enter your C++ code: ")

# Scan the code for ids, strings, keywords, and signs
result = cpp_code(code)

# Display the matches with appropriate formatting
for match in result:
    if re.match(id_pattern, match):
        print("ID => {}".format(match))
    elif re.match(str_pattern, match):
        print("STR => {}".format(match))
    elif match in keyword_patterns:
        print("KEYWORD => {}".format(match))
    elif match in sign_patterns:
        print("SIGN => {}".format(match))
    elif re.match(parenthesis_pattern , match):
        print("PARENTHESIS => {}".format(match))
    elif re.match(brackets_pattern , match): 
        print("BRACKET => {}".format(match))
    elif re.match(braces_pattern, match):
        print("BRACKET => {}".format(match))
    elif re.match(number_pattern, match):
        print("NUMBER => {}".format(match))
    else:
        print("UNKNOWN => {}".format(match))
