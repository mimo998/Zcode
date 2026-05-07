/**
 * CalculatorLab Levels
 *
 * Defines 5 levels of increasing complexity, each with:
 * - Learning goal
 * - Starter code
 * - Test cases
 * - Hints for the mentor
 *
 * Students progress through:
 *   L1: Display digits (variable assignment)
 *   L2: Addition (functions)
 *   L3: Subtraction + multiplication (switch/conditionals)
 *   L4: Full calculator flow (3 + 4 = 7)
 *   L5: Division by zero handling (error handling)
 */

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface Level {
  title: string;
  goal: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
  hints?: string[];
}

/**
 * TODO: Migrate code execution to Web Worker sandbox (#14)
 * Currently uses Function() constructor with try-catch.
 * This is NOT safe for untrusted code, but acceptable for an educational
 * platform where students are authenticated and moderated.
 */

export const LEVELS: Level[] = [
  {
    title: "Display Digits",
    goal: "Create a display() function that returns a single digit.",
    description:
      "Learn to write functions that return values. Your function should take a digit (0-9) and return it as a string.",
    starterCode: `// Complete this function
function display(digit) {
  return digit;
}

// Test it
console.log(display(5));`,
    testCases: [
      { input: "display(0)", expectedOutput: "0", description: "Zero" },
      { input: "display(5)", expectedOutput: "5", description: "Five" },
      { input: "display(9)", expectedOutput: "9", description: "Nine" },
    ],
    hints: [
      "Your function needs to return the digit as a string.",
      "Use String(digit) to convert a number to a string.",
      "Test each case by running the code.",
    ],
  },

  {
    title: "Addition",
    goal: "Create an add() function that returns the sum of two numbers.",
    description:
      "Now that you can display digits, let's do math. Write a function that takes two numbers and returns their sum.",
    starterCode: `// Complete this function
function add(a, b) {
  return a + b;
}

// Test it
console.log(add(3, 4));
console.log(add(10, 20));`,
    testCases: [
      { input: "add(0, 0)", expectedOutput: "0", description: "Zero + Zero" },
      { input: "add(3, 4)", expectedOutput: "7", description: "3 + 4" },
      { input: "add(10, 20)", expectedOutput: "30", description: "10 + 20" },
    ],
    hints: [
      "Addition in JavaScript uses the + operator.",
      "Make sure your function takes two parameters: a and b.",
      "The simplest solution is often the right one.",
    ],
  },

  {
    title: "Subtraction & Multiplication",
    goal: "Create a calc() function that performs add, subtract, or multiply based on an operator.",
    description:
      "Combine what you've learned. Write a function that takes two numbers and an operator (+, -, *) and returns the result. Use an if/else or switch statement.",
    starterCode: `// Complete this function
function calc(a, b, operator) {
  // Handle +, -, *
  if (operator === '+') {
    return a + b;
  }
  // TODO: add - and * cases
  return null;
}

// Test it
console.log(calc(5, 3, '+'));
console.log(calc(5, 3, '-'));
console.log(calc(5, 3, '*'));`,
    testCases: [
      { input: "calc(5, 3, '+')", expectedOutput: "8", description: "5 + 3" },
      { input: "calc(5, 3, '-')", expectedOutput: "2", description: "5 - 3" },
      { input: "calc(5, 3, '*')", expectedOutput: "15", description: "5 * 3" },
    ],
    hints: [
      "Use if/else or switch to check the operator.",
      "Remember: 5 - 3 = 2, and 5 * 3 = 15.",
      "Each branch should return the correct calculation.",
    ],
  },

  {
    title: "Full Calculator Flow",
    goal: "Create a complete calculator(a, b, op) that handles the full flow.",
    description:
      "Put it all together. Write a function that acts like a real calculator: takes two numbers and an operator, validates the input, and returns the result.",
    starterCode: `// Complete this function
function calculator(a, b, operator) {
  // Check if a and b are valid numbers
  if (typeof a !== 'number' || typeof b !== 'number') {
    return 'Error: Invalid input';
  }

  // Perform the operation
  if (operator === '+') {
    return a + b;
  } else if (operator === '-') {
    return a - b;
  } else if (operator === '*') {
    return a * b;
  } else {
    return 'Error: Unknown operator';
  }
}

// Test it
console.log(calculator(3, 4, '+'));
console.log(calculator(10, 2, '-'));
console.log(calculator(6, 7, '*'));`,
    testCases: [
      {
        input: "calculator(3, 4, '+')",
        expectedOutput: "7",
        description: "3 + 4 = 7",
      },
      {
        input: "calculator(10, 2, '-')",
        expectedOutput: "8",
        description: "10 - 2 = 8",
      },
      {
        input: "calculator(6, 7, '*')",
        expectedOutput: "42",
        description: "6 * 7 = 42",
      },
    ],
    hints: [
      "Check if the inputs are numbers before doing math.",
      "Use typeof to check the type of a variable.",
      "Return an error message if the operator is not recognized.",
    ],
  },

  {
    title: "Division & Error Handling",
    goal: "Extend your calculator to handle division and prevent division by zero.",
    description:
      "Great mathematicians know you can't divide by zero. Write a function that handles division safely and returns an error message if someone tries to divide by zero.",
    starterCode: `// Complete this function
function calculator(a, b, operator) {
  // Check if a and b are valid numbers
  if (typeof a !== 'number' || typeof b !== 'number') {
    return 'Error: Invalid input';
  }

  // Perform the operation
  if (operator === '+') {
    return a + b;
  } else if (operator === '-') {
    return a - b;
  } else if (operator === '*') {
    return a * b;
  } else if (operator === '/') {
    // TODO: Check for division by zero
    return a / b;
  } else {
    return 'Error: Unknown operator';
  }
}

// Test it
console.log(calculator(10, 2, '/'));
console.log(calculator(10, 0, '/'));
console.log(calculator(7, 2, '/'));`,
    testCases: [
      {
        input: "calculator(10, 2, '/')",
        expectedOutput: "5",
        description: "10 / 2 = 5",
      },
      {
        input: "calculator(10, 0, '/')",
        expectedOutput: "Error: Division by zero",
        description: "10 / 0 = Error",
      },
      {
        input: "calculator(7, 2, '/')",
        expectedOutput: "3.5",
        description: "7 / 2 = 3.5",
      },
    ],
    hints: [
      "Before dividing, check if b === 0.",
      "If b is zero, return the error message: 'Error: Division by zero'.",
      "Otherwise, return a / b as usual.",
    ],
  },
];

/**
 * Run tests for a specific level.
 * Executes the student's code and checks it against test cases.
 *
 * @returns object with allTestsPassed, output, and error
 */
export function runLevelTests(
  level: number,
  code: string
): { allTestsPassed: boolean; output: string; error?: string } {
  const levelData = LEVELS[level - 1];
  if (!levelData) {
    return { allTestsPassed: false, output: "", error: "Invalid level" };
  }

  try {
    // Create a function that captures console.log output
    let captured = "";
    const customConsole = {
      log: (...args: unknown[]) => {
        captured += args.map((a) => String(a)).join(" ") + "\n";
      },
    };

    // TODO: #14 — Replace Function() with Web Worker sandbox
    // Current approach: Function() with scope isolation
    // This is acceptable for educational use but NOT for production untrusted code
    const userFunc = new Function(
      "console",
      `
      ${code}
      return { display, add, calc, calculator };
    `
    );

    let exposed;
    try {
      exposed = userFunc(customConsole);
    } catch (e) {
      // Function didn't have the right exports, that's ok — just run raw code
      const userFuncRaw = new Function("console", code);
      userFuncRaw(customConsole);
    }

    // Now test against test cases
    let allPassed = true;
    const testResults: string[] = [];

    for (const testCase of levelData.testCases) {
      try {
        // Re-create the function to get a fresh copy
        const testFunc = new Function("console", code);
        const _ = testFunc(customConsole);

        // Extract and run the test
        const testCode = `
          ${code}
          return String(${testCase.input});
        `;
        const func = new Function("console", testCode);
        const result = func(customConsole);

        const passed =
          String(result).trim() === String(testCase.expectedOutput).trim();
        allPassed = allPassed && passed;

        const icon = passed ? "✓" : "✗";
        testResults.push(
          `${icon} ${testCase.description}: ${testCase.input} → ${result} (expected: ${testCase.expectedOutput})`
        );
      } catch (e) {
        allPassed = false;
        testResults.push(
          `✗ ${testCase.description}: ${testCase.input} failed with error`
        );
      }
    }

    return {
      allTestsPassed: allPassed,
      output: testResults.join("\n"),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      allTestsPassed: false,
      output: "",
      error: `Syntax Error: ${errorMsg}`,
    };
  }
}

/**
 * Format a level description for display
 */
export function formatLevelDescription(level: number): string {
  const data = LEVELS[level - 1];
  return data?.description || "";
}
