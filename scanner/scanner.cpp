#include <ctype.h>
#include <fstream>
#include <iostream>
#include <stdlib.h>
#include <string.h>
using namespace std;

bool isPunctuator(char ch) {
  if (ch == ' ' || ch == '+' || ch == '-' || ch == '*' || ch == '/' ||
      ch == ',' || ch == ';' || ch == '>' || ch == '<' || ch == '=' ||
      ch == '(' || ch == ')' || ch == '[' || ch == ']' || ch == '{' ||
      ch == '}' || ch == '&' || ch == '|') {
    return true;
  }
  return false;
}

bool validIdentifier(char *str) {
  if (str[0] == '0' || str[1] == '1' || str[2] == '2' || str[3] == '3' ||
      str[4] == '4' || str[5] == '5' || str[6] == '6' || str[7] == '7' ||
      str[8] == '8' || str[9] == '9' || isPunctuator(str[0]) == true) {
    return false;
  } else {
    int i, len = strlen(str);
    for (i = 1; i < len; i++) {
      if (isPunctuator(str[i]) == true) {
        return false;
      }
    }
  }
  return true;
}

bool isOperator(char ch) {
  if (ch == '+' || ch == '-' || ch == '*' || ch == '/' || ch == '>' ||
      ch == '<' || ch == '=' || ch == '|' || ch == '&') {
    return true;
  }
  return false;
}

bool isKeyword(char *str) {
  if (!strcmp(str, "if") || !strcmp(str, "else") || !strcmp(str, "while") ||
      !strcmp(str, "do") || !strcmp(str, "break") || !strcmp(str, "continue") ||
      !strcmp(str, "int") || !strcmp(str, "double") || !strcmp(str, "float") ||
      !strcmp(str, "return") || !strcmp(str, "char") || !strcmp(str, "case") ||
      !strcmp(str, "long") || !strcmp(str, "short") ||
      !strcmp(str, "typedef") || !strcmp(str, "switch") ||
      !strcmp(str, "unsigned") || !strcmp(str, "void") ||
      !strcmp(str, "static") || !strcmp(str, "struct") ||
      !strcmp(str, "sizeof") || !strcmp(str, "volatile") ||
      !strcmp(str, "enum") || !strcmp(str, "const") || !strcmp(str, "union") ||
      !strcmp(str, "extern") || !strcmp(str, "bool")) {
    return true;
  } else {
    return false;
  }
}

bool isNumber(char *str) {
  int i, len = strlen(str), numOfDecimal = 0;
  if (len == 0) {
    return false;
  }
  for (i = 0; i < len; i++) {
    if (numOfDecimal > 1 && str[i] == '.') {
      return false;
    } else if (numOfDecimal <= 1 && str[i] == '.') {
      numOfDecimal++;
    }
    if (str[i] != '0' && str[i] != '1' && str[i] != '2' && str[i] != '3' &&
        str[i] != '4' && str[i] != '5' && str[i] != '6' && str[i] != '7' &&
        str[i] != '8' && str[i] != '9' && !(str[i] == '-' && i > 0)) {
      return false;
    }
  }
  return true;
}

char *subString(char *realStr, int l, int r) {
  int i;
  char *str = (char *)malloc(sizeof(char) * (r - l + 2));
  for (i = l; i <= r; i++) {
    str[i - l] = realStr[i];
  }
  str[r - l + 1] = '\0';
  return str;
}

void parse(char *str) {
  int left = 0, right = 0;
  int len = strlen(str);
  while (right <= len && left <= right) {
    if (isPunctuator(str[right]) == false) {
      right++;
    }

    if (isPunctuator(str[right]) == true && left == right) {
      if (isOperator(str[right]) == true) {
        cout << "O{ " << str[right] << " }"
             << " IS AN OPERATOR\n";
      } else {
        cout << "P{ " << str[right] << " }"
             << " IS A PUNCTUATOR\n";
      }
      right++;
      left = right;
    } else if (isPunctuator(str[right]) == true && left != right ||
               (right == len && left != right)) {
      char *sub = subString(str, left, right - 1);

      if (isKeyword(sub) == true) {
        cout << "K{ " << sub << " }"
             << " IS A KEYWORD\n==========\n";
      } else if (isNumber(sub) == true) {
        cout << "N{ " << sub << " }"
             << " IS A NUMBER\n==========\n";
      } else if (validIdentifier(sub) == true &&
                 isPunctuator(str[right - 1]) == false) {
        cout << "I{ " << sub << " }"
             << " IS A VALID IDENTIFIER\n==========\n";
      } else if (validIdentifier(sub) == true &&
                 isPunctuator(str[right - 1]) == true) {
        cout << sub << " IS NOT A VALID IDENTIFIER\n==========\n";
      }
      left = right;
    }
  }
  return;
}

int main() {
  cout << "Enter your code: ";
  string code;
  getline(cin, code);
  char c[100];
  strncpy(c, code.c_str(), sizeof(c) - 1);
  c[sizeof(c) - 1] = '\0';
  parse(c);
  return 0;
}
