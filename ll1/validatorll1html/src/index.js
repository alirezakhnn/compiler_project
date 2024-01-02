var EPSILON = "''"; // Input representation of empty string

var synthetic_start = "S"; // Artificial start non-terminal
var sentinel = "$"; // End-of-input sentinel

var state; // state of the parser
var grammar;
var nullable; // set of nullable nonterminals
var first; // first table
var follow; // follow table
var transition; // transition table

function $element(id) {
  return document.getElementById(id);
}

function union(set1, set2) {
  let u = new Set(set1);
  for (let elt of set2) {
    u.add(elt);
  }
  return u;
}

// Given a map m from keys to sets of elements, add elt to m[key]
// if elt was not already in m[key], set the m.changed flag
function addToSetMap(m, key, elt) {
  if (!m[key].has(elt)) {
    m[key].add(elt);
    m.changed = true;
  }
}

function computeNullable(grammar) {
  console.log("Computing nullable...");
  var nullable = new Set();
  var fixpoint = false;
  var iteration = 0;
  while (!fixpoint) {
    fixpoint = true;
    for (rule of grammar.rules) {
      // RHS is nullable iff every symbol in the RHS is nullable
      if (rule.rhs.every((x) => nullable.has(x))) {
        if (!nullable.has(rule.lhs)) {
          nullable.add(rule.lhs);
          fixpoint = false;
        }
      }
    }
    console.log("  Nullable table @ iteration " + ++iteration);
    console.log("    " + Array.from(nullable).join(", "));
  }
  console.log("Done!");
  return nullable;
}

// compute first of a right-hand-side of a production (i.e., a
// sequence of terminals and noterminals).
function firstRhs(rhs, nullable, first) {
  // find longest nullable prefix
  var end = rhs.findIndex((sym) => !nullable.has(sym));
  if (end == -1) {
    end = rhs.length;
  }
  return rhs
    .slice(0, end + 1)
    .map((sym) => first[sym])
    .reduce(union, new Set());
}

function computeFirst(grammar, nullable) {
  console.log("Computing first...");
  var first = {};

  // To simplify first/follow logic, define first(t) = {t} for any terminal t
  for (terminal of grammar.terminals) {
    first[terminal] = new Set([terminal]);
  }
  for (nonterminal of grammar.nonterminals) {
    first[nonterminal] = new Set();
  }

  first.changed = true;
  var iteration = 0;
  while (first.changed) {
    first.changed = false;
    for (rule of grammar.rules) {
      firstRhs(rule.rhs, nullable, first).forEach((terminal) =>
        addToSetMap(first, rule.lhs, terminal),
      );
    }
    console.log("  First table @ iteration " + ++iteration);
    console.log(stringOfSetMap(first, 4));
  }
  console.log("Done!");

  return first;
}

function computeFollow(grammar, nullable, first) {
  console.log("Computing follow...");

  var follow = {};
  for (nonterminal of grammar.nonterminals) {
    follow[nonterminal] = new Set();
  }
  follow.changed = true;
  var iteration = 0;
  while (follow.changed) {
    follow.changed = false;

    for (rule of grammar.rules) {
      // invariant: rule_follow is the follow set for position i of rule.rhs
      var rule_follow = follow[rule.lhs];
      for (i = rule.rhs.length - 1; i >= 0; i--) {
        if (grammar.nonterminals.has(rule.rhs[i])) {
          rule_follow.forEach(function (terminal) {
            addToSetMap(follow, rule.rhs[i], terminal);
          });
        }
        if (nullable.has(rule.rhs[i])) {
          rule_follow = union(rule_follow, first[rule.rhs[i]]);
        } else {
          rule_follow = first[rule.rhs[i]];
        }
      }
    }
    console.log("  Follow table @ iteration " + ++iteration);
    console.log(stringOfSetMap(follow, 4));
  }
  console.log("Done!");
  return follow;
}

function computeLL1Tables(grammar) {
  nullable = computeNullable(grammar);
  first = computeFirst(grammar, nullable);
  follow = computeFollow(grammar, nullable, first);

  // Compute transition table
  transition = {};
  for (n of grammar.nonterminals) {
    transition[n] = {};
    for (t of grammar.terminals) {
      transition[n][t] = [];
    }
  }
  for (rule of grammar.rules) {
    for (a of firstRhs(rule.rhs, nullable, first)) {
      transition[rule.lhs][a].push(rule);
    }

    if (rule.rhs.every((x) => nullable.has(x))) {
      for (a of follow[rule.lhs]) {
        transition[rule.lhs][a].push(rule);
      }
    }
  }
}

function grammarChanged() {
  var rules = [];
  var nonterminals = new Set(synthetic_start);
  for (var rule of $element("grammar").value.split("\n")) {
    let split_rule = rule.split("::=");
    if (split_rule.length == 2) {
      let lhs = split_rule[0].trim();
      let rhs = split_rule[1]
        .trim()
        .split(/\s+/)
        .filter((x) => !(x == EPSILON));
      rules.push({
        lhs,
        rhs,
      });
      nonterminals.add(lhs);
    }
  }

  var terminals = new Set(sentinel);
  for (rule of rules) {
    rule.rhs.forEach(function (symbol) {
      if (!nonterminals.has(symbol)) {
        terminals.add(symbol);
      }
    });
  }

  // Use the left hand side of the first rule as starting nonterminal
  start = rules[0].lhs;

  rules.push({
    lhs: synthetic_start,
    rhs: [start, sentinel],
  });

  grammar = {
    rules,
    terminals,
    nonterminals,
    start,
  };

  computeLL1Tables(grammar);
  displayTables();
}

var ok; // parser state error?
var tree;
var parents;
var index = 0;

// precondition: nullable, first, follow, transition are already initialized
function displayTables() {
  $element("firstFollowTableHead").innerHTML =
    "<th>Nonterminal</th><th>Nullable?</th><th>First</th><th>Follow</th>";
  $element("firstFollowTableRows").innerHTML = "";
  for (nonterminal of grammar.nonterminals) {
    var s = "<tr>";
    s += "<tr>";
    s += '<td nowrap="nowrap">' + nonterminal + "</td>";
    s +=
      '<td nowrap="nowrap">' +
      (nullable.has(nonterminal) ? "&#10004;" : "&#10006;") +
      "</td>";
    s +=
      '<td nowrap="nowrap">' +
      Array.from(first[nonterminal]).join(", ") +
      "</td>";
    s +=
      '<td nowrap="nowrap">' +
      Array.from(follow[nonterminal]).join(", ") +
      "</td>";
    s += "</tr>";
    $element("firstFollowTableRows").innerHTML += s;
  }

  $element("llTableHead").innerHTML = "<th></th>";

  for (var terminal of grammar.terminals) {
    $element("llTableHead").innerHTML += "<th>" + terminal + "</th>";
  }

  $element("llTableRows").innerHTML = "";
  var conflict = false;
  for (var nonterminal of grammar.nonterminals) {
    var s = "<tr>";
    s += "<tr>";
    s += '<td nowrap="nowrap">' + nonterminal + "</td>";

    for (var terminal of grammar.terminals) {
      var contents = transition[nonterminal][terminal]
        .map(stringOfRule)
        .join("<br />");

      if (transition[nonterminal][terminal].length > 1) {
        s +=
          '<td nowrap="nowrap" style="color: white; background-color: red">' +
          contents +
          "</td>";
        conflict = true;
      } else {
        s += '<td nowrap="nowrap">' + contents + "</td>";
      }
    }

    s += "</tr>";

    $element("llTableRows").innerHTML += s;
  }

  if (conflict) {
    alert("Conflict detected. Grammar is not LL(1)!");
  }
}

function stringOfRule(rule) {
  if (rule.rhs.length == 0) {
    return rule.lhs + " ::= ε";
  } else {
    return rule.lhs + " ::= " + rule.rhs.join(" ");
  }
}

function stringOfSetMap(m, indent) {
  var s = "";
  for (key in m) {
    if (key != "changed") {
      s +=
        " ".repeat(indent) +
        key +
        " -> " +
        Array.from(m[key]).join(", ") +
        "\n";
    }
  }
  return s;
}

function resize(textInput, minimumSize) {
  textInput.size = Math.max(minimumSize, textInput.value.length);
}

var w = 800,
  h = 400,
  root = {},
  d3tree = d3.layout.tree().size([w, h]),
  diagonal = d3.svg.diagonal(),
  duration = 250;
var cnt = 0;

var vis = d3
  .select("svg")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .append("g")
  .attr("transform", "translate(20, 20)");

// Initialize parser state
function parseInputStart() {
  // Place a $ token at the end of the input string
  (input = $element("input").value.trim().split(/\s/).concat([sentinel])),
    (stack = ["$", grammar.start]);

  state = {
    position: 0,
    stack: stack,
    input: input,
    transition: transition,
    terminals: grammar.terminals,
    nonterminals: grammar.nonterminals,
  };

  start = grammar.start;
  ok = true;

  /* Display code ********************************************************/
  parsingRows =
    '<tr><td nowrap="nowrap">' +
    state.stack.join(" ") +
    '</td><td nowrap="nowrap">' +
    state.input.join(" ") +
    ' $</td nowrap="nowrap"><td></td></tr>\n';

  tree = new Object();
  tree.label = "root";
  tree.children = [];
  tree.name = start;
  index = 0;

  $element("ruleDisplay").value = "";
  resize($element("ruleDisplay"), 10);

  $element("stepButton").removeAttribute("disabled");

  d3.selectAll("svg > *").remove();
  vis = d3
    .select("svg")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(20, 20)");
  d3tree = d3.layout.tree().size([w - 20, h - 50]);
  diagonal = d3.svg.diagonal();
  root = {
    label: "root",
    id: "id0",
    children: [],
  };
  cnt = 0;

  var pnode = new Object();
  pnode.label = start;
  pnode.children = [];
  pnode.id = "id" + ++cnt;
  pnode.parent = root;
  update(root, pnode);

  parents = [pnode];

  $element("stack").value = state.stack.join(" ");
  resize($element("stack"), 10);
  $element("remInput").value = state.input.slice(index).join(" ");
  resize($element("remInput"), 10);
  $element("input").style.color = ok ? "green" : "red";
}

// Execute one step of the parser.
function parseInputStep() {
  if (state.position >= state.input.length) {
    alert("Parsing complete! Press reset to see it again.");
    return;
  }
  var top = state.stack.pop();
  var next = state.input[state.position];

  var rule = "";
  if (state.terminals.has(top)) {
    // If top of the stack matches next input character, consume the input
    if (next == top) {
      state.position++;
      parents.pop();

      $element("ruleDisplay").value = "Match " + next;
      resize($element("ruleDisplay"), 10);
    } else {
      ok = false;
      alert("Expected " + top + ", got " + next);
      return;
    }
  } else if (next in state.transition[top]) {
    var rule = state.transition[top][next][0];
    if (rule == undefined) {
      ok = false;
      alert(
        'Syntax error when trying to expand elements at the top of the stack:\nNo valid transition from a nonterminal "' +
          top +
          '" with look ahead symbol "' +
          next +
          '"',
      );
    }

    state.stack.push(...[].concat(rule.rhs).reverse());

    /* Display code ********************************************************/
    var p = parents.pop();
    childnodes = [];
    if (rule.rhs.length == 0) {
      var node = new Object();
      node.label = "ε";
      node.children = [];
      node.id = "id" + ++cnt;
      node.parent = p;
      update(p, node);
    } else {
      for (var i of rule.rhs) {
        var node = new Object();
        node.label = i;
        node.children = [];
        node.id = "id" + ++cnt;
        node.parent = p;
        update(p, node);
        childnodes.push(node);
      }
    }
    parents = parents.concat(childnodes.reverse());
    $element("ruleDisplay").value = stringOfRule(rule);
    resize($element("ruleDisplay"), 10);
  } else {
    ok = false;
    alert("failure");
  }
  $element("stack").value = state.stack.join(" ");
  resize($element("stack"), 10);
  $element("remInput").value = state.input.slice(state.position).join(" ");
  resize($element("remInput"), 10);
  $element("input").style.color = ok ? "green" : "red";
}

function update(parent, cnode) {
  if (parent.children) {
    parent.children.push(cnode);
  } else {
    parent.children = [cnode];
  }

  // Compute the new tree layout. We'll stash the old layout in the data.
  var nodes = d3tree(root.children[0]);

  // Update the nodes…
  var node = vis.selectAll("text").data(nodes, (d) => d.id);

  var nodeEnter = node.enter();

  nodeEnter
    .append("text")
    .attr("dx", ".5em")
    .attr("font-family", "serif")
    .attr("font-size", "20px")
    .text(function (d) {
      return d.label;
    })
    .attr("x", function (d) {
      return d.parent.x0;
    })
    .attr("y", function (d) {
      return d.parent.y0;
    })
    .transition()
    .duration(duration)
    .attr("x", (d) => (d.x0 = d.x))
    .attr("y", (d) => (d.y0 = d.y));

  node.exit().remove();

  node
    .transition()
    .duration(duration)
    .attr("x", (d) => (d.x0 = d.x))
    .attr("y", (d) => (d.y0 = d.y));

  // Update the links…
  var link = vis
    .selectAll("path.link")
    .data(d3tree.links(nodes), (d) => d.source.id + "-" + d.target.id);

  // Enter any new links at the parent's previous position.
  link
    .enter()
    .insert("svg:path", "circle")
    .attr("class", "link")
    .attr("d", function (d) {
      var o = {
        x: d.source.x0,
        y: d.source.y0,
      };
      return diagonal({
        source: o,
        target: o,
      });
    })
    .transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition links to their new position.
  link.transition().duration(duration).attr("d", diagonal);
}
