def scanner(code)
  keyword_patterns = [
    /\bif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/, /\bint\b/, /\bstr\b/, /\bfloat\b/,
    /\bdouble\b/, /\bauto\b/, /\benum\b/, /\bextern\b/, /\bprotected\b/, /\btypedef\b/,
    /\bconst\b/, /\bcontinue\b/, /\bdefault\b/, /\bswitch\b/, /\bcase\b/, /\bshort\b/,
    /\bsigned\b/, /\bdelete\b/, /\bdo\b/, /\blong\b/, /\bstruct\b/, /\bstatic\b/, /\bvoid\b/,
    /\bvirtual\b/, /\bsizeof\b/, /\breturn\b/, /\bthrow\b/, /\bpublic\b/, /\bprivate\b/,
    /\bthis\b/, /\biostream\b/, /\bbreak\b/, /\bclass\b/, /\bchar\b/, /\btemplate\b/, /\basm\b/,
    /\binline\b/, /\bvolatile\b/, /\bunsigned\b/, /\btry\b/, /\bcatch\b/, /\bcout\b/, /\bcin\b/,
    /\binclude\b/, /\bstd\b/, /\bendl\b/, /\bmain\b/, /\bbool\b/, /\band\b/, /\bor\b/, /\bnot\b/,
    /\btrue\b/, /\bfalse\b/, /\balignas\b/, /\balignof\b/, /\bbitor\b/, /\bbitor\b/, /\bbitand\b/,
    /\bchar8_t\b/, /\bchar16_t\b/, /\bchar32_t\b/, /\bcomp\b/, /\bconcept\b/, /\bconsteval\b/,
    /\bconstexpr\b/, /\bconstinit\b/, /\bconst_cast\b/, /\bco_await\b/, /\bco_return\b/,
    /\bco_yield\b/, /\bdecltype\b/, /\bdelete\b/, /\bdobre\b/, /\bdynamic_cast\b/, /\bexplicit\b/,
    /\bexport\b/, /\bfalse\b/, /\bfreint\b/, /\bgoto\b/, /\binline\b/, /\blong\b/, /\bmutable\b/,
    /\bnamespace\b/, /\bnew\b/, /\bnoexcept\b/, /\bnot\b/, /\bnot_ex\b/, /\bpublic\b/,
    /\breflexpr\b/, /\bregister\b/, /\breinterpret_cast\b/, /\brequires\b/, /\breturn\b/,
    /\bshort\b/, /\bsigned\b/, /\bsizof\b/, /\bstatic\b/, /\bstatic_assert\b/, /\bstatic_cast\b/,
    /\bstruct\b/, /\bswitch\b/, /\bsynchronized\b/, /\btemplate\b/, /\bthis\b/, /\bthread_lcal\b/,
    /\bthrow\b/, /\btrue\b/, /\btry\b/, /\btypedef\b/, /\btypeid\b/, /\btypename\b/, /\bunion\b/,
    /\bunsigned\b/, /\busing\b/, /\bvirtual\b/, /\bvoid\b/, /\bvolatile\b/, /\bwchar_t\b/,
    /\bwhile\b/, /\bxor_ex\b/, /\bistream\b/, /\bostream\b/, /\bfstream\b/, /\bifstream\b/,
    /\bofstream\b/, /\bistringstream\b/, /\bostringstream\b/, /\bvector\b/, /\blist\b/,
    /\bmap\b/, /\bset\b/, /\balgorithm\b/, /\bnumeric\b/, /\bcmath\b/, /\bcstring\b/,
    /\bctime\b/, /\bcstdio\b/, /\blocale\b/, /\bmemory\b/, /\bstdexcept\b/, /\bthread\b/,
    /\bchrono\b/, /\brandom\b/, /\bmutex\b/, /\bcondition_variable\b/, /\batomic\b/
  ]

  sign_patterns = [/\+/, /-/, /\*/, /\//, /%/, /,/, /&/, /#/]
  compare_pattern = /==|!=|<=|>=|<|>/
  id_pattern = /(?!(?:#{keyword_patterns.map { |kw| kw.source }.join('|')})\b)(?:[a-zA-Z_]\w*)\b/
  str_pattern = /"#{id_pattern.source}"/
  number_pattern = /\b\d+\b|\b\d+\.\d+\b/
  open_parenthesis_pattern = /\(/
  close_parenthesis_pattern = /\)/
  open_bracket_pattern = /\[/
  close_bracket_pattern = /\]/
  open_brace_pattern = /\{/
  close_brace_pattern = /\}/
  semicolon_pattern = /;/
  assign_pattern = /=/

  all_patterns = [
    id_pattern, str_pattern, number_pattern,
    open_parenthesis_pattern, close_parenthesis_pattern,
    open_bracket_pattern, close_bracket_pattern, open_brace_pattern,
    close_brace_pattern, semicolon_pattern, assign_pattern, compare_pattern
  ] + keyword_patterns + sign_patterns

  scanner_pattern = Regexp.union(*all_patterns)

# code: Represents the input code, which is a string.
#
# scanner_pattern: Refers to the pattern or regular expression used to scan the code string and find matches.
#
# scan: It is a method available for strings in many programming languages including Ruby.
# The scan method searches for all matches of a given pattern in the string and returns an array of the matching substrings.
#
# matches: Represents the array that stores the matching substrings found in the code string based on the scanner_pattern.
  matches = code.scan(scanner_pattern)

  matches.each do |match|
  # keyword_patterns: Represents an array containing different patterns or keywords that need to be matched against the match string.
  #
  # any?: It is a method available for arrays in many programming languages including Ruby.
    # The any? method checks if at least one element 
    # in the array satisfies a given condition.
  #
  # { |kw| match.match?(kw) }: This is a block of code that is passed to the any? method. 
    # The block contains a parameter kw which represents each element of the 
    # keyword_patterns array, one at a time.
  #
  # match: Refers to a string that is being checked 
    # against the patterns in keyword_patterns.
  #
  # match.match?(kw): This is an expression that checks if the match string matches the 
    # pattern specified by kw. The match? method is used to perform the pattern matching.
  #
  # The code inside the block { |kw| match.match?(kw) } is executed for each element (kw)
    # in the keyword_patterns array. The match.match?(kw) expression checks 
    # if match matches the current pattern (kw). 
    # If any of the patterns in keyword_patterns match the match string,
    # then the any? method returns true, indicating that at least one pattern matched.
    # If none of the patterns match, any? returns false.
  #
  # So, the entire line of code if keyword_patterns.any? { |kw| match.match?(kw) } 
    # is used to conditionally execute a block of code 
    # if any pattern in keyword_patterns matches the match string.
    if keyword_patterns.any? { |kw| match.match?(kw) }
      puts "Keyword -> (#{match})"
    elsif match.match?(str_pattern)
      puts "Str -> (#{match})"
    elsif match.match?(open_parenthesis_pattern)
      puts "Open Paren -> (#{match})"
    elsif match.match?(close_parenthesis_pattern)
      puts "Close Paren -> (#{match})"
    elsif match.match?(open_bracket_pattern)
      puts "Open bracket -> (#{match})"
    elsif match.match?(close_bracket_pattern)
      puts "Close bracket -> (#{match})"
    elsif match.match?(open_brace_pattern)
      puts "Open brace -> (#{match})"
    elsif match.match?(close_brace_pattern)
      puts "Close brace -> (#{match})"
    elsif match.match?(semicolon_pattern)
      puts "Semicolumn -> (#{match})"
    elsif match.match?(compare_pattern)
      puts "Comparison -> (#{match})"
    elsif match.match?(assign_pattern)
      puts "Assign -> (#{match})"
    elsif sign_patterns.any? { |sign| match.match?(sign) }
      puts "Sign -> (#{match})"
    elsif match.match?(number_pattern) { |number| match.match?(number) }
      puts "Number -> (#{match})"
    else
      puts "id -> (#{match})"
    end
  end

  return matches
end

print "Enter your C++ code: "
# gets: It is a method in Ruby used to read user input from the command line.
#
# chomp: It is another method in Ruby that removes the trailing newline 
# character from the input string. When you input something and press Enter,
# a newline character is added at the end of the input. The chomp method
# removes that newline character, and the resulting string does not 
# contain any trailing whitespace.
#
# code: It is a variable that stores the user input after removing the newline character.
code = gets.chomp

result = scanner(code)
