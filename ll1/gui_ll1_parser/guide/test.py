import re

def cpp_scanner(input_code):
    # Define a list of extended C++ keywords and reserved words
    cpp_keywords = [r'if',r'else',r'for',r'while',r'int',r'str',r'float',r'double',r'auto',r'enum',r'extern',r'protected',r'typedef',r'const',
            r'continue',r'default',r'switch',r'case',r'short',r'signed',r'delete',r'do',r'long',r'struct',r'static',r'void',r'virtual',r'sizeof',
            r'return',r'throw',r'public', r'private',r'this',r'break',r'class',
            r'char',r'template',r'asm',r'inline', r'volatile',r'unsigned',r'try',r'catch',r'cout',r'cin',r'include',r'std',r'endl',r'char',r'main',r'include',r'iostream'
            ]

    # Replace variable names with "id" excluding C++ keywords
    modified_code = re.sub(r'\b(?!(?:' + '|'.join(cpp_keywords) + r')\b)([a-zA-Z_][a-zA-Z0-9_]*)\b', 'id', input_code)

    # Replace string literals with "str"
    modified_code = re.sub(r'\".*?\"', 'str', modified_code)

    return modified_code

# Example usage:
cpp_code = """
int main() {
int x = 5;
double y = 3.14;
string text = "Hello, world!";
cout << x << y << text << endl;
return 0;
}
"""

result = cpp_scanner(cpp_code)
print(result)