"""
Figure Puzzle Generator
"""

import itertools
import json
import random
import sys

def main():
    # Optionally specify difficulty in command line argument
    # difficulty = int(sys.argv[1]) if len(sys.argv) == 2 else 1
    # if difficulty < 1 or difficulty > 3:
    #     print("Invalid difficulty.")
    #     return

    puzzles = []
    for difficulty in [1, 1, 2, 2, 3, 3]:
        puzzle = generate_puzzle(difficulty)
        puzzles.append((difficulty, puzzle))

    for difficulty, puzzle in puzzles:
        print_puzzle(difficulty, puzzle)

    print()

    for difficulty, puzzle in puzzles:
        print_puzzle(difficulty, puzzle, show_solution=True)


def generate_puzzle(difficulty):
    """
    Generate a new puzzle.
    """

    def generate_values():
        """Choose starting values to calculate from."""
        values = set()
        # Three values in [2, 10]
        while len(values) < 3:
            values.add(random.randint(2, 10))
        # Three values in [11, 19]
        while len(values) < 6:
            values.add(random.randint(11, 19))
        # Two values in [20, 29]
        while len(values) < 8:
            values.add(random.randint(21, 29))
        return values

    def generate_num_operations(difficulty):
        if difficulty == 1:
            return 2
        if difficulty == 2:
            return random.randint(3, 4)
        if difficulty == 3:
            return random.randint(5, 6)


    def generate_difficulty_range(difficulty):
        if difficulty == 1:
            return [11, 50]
        elif difficulty == 2:
            return [51, 200]
        elif difficulty == 3:
            return [201, 449]

    def generate_solution(values, num_operations):
        values = [("", value) for value in values]
        solution = []

        for _ in range(len(values) - num_operations - 1):
            number_to_remove = random.choice(list(values))
            values.remove(number_to_remove)

        for _ in range(num_operations):

            operations = []
            for (op1, val1), (op2, val2) in itertools.combinations(values, 2):
                if val1 > val2 and val1 % val2 == 0:
                    operations.append(("/", (op1, val1), (op2, val2)))
                if val2 > val1 and val2 % val1 == 0:
                    operations.append(("/", (op2, val2), (op1, val1)))
                operations.append(("+", (op1, val1), (op2, val2)))
                if op1 not in ["", "*"] or op2 not in ["", "*"]:
                    operations.append(("*", (op1, val1), (op2, val2)))
                if val1 > val2:
                    operations.append(("-", (op1, val1), (op2, val2)))
                elif val2 > val1:
                    operations.append(("-", (op2, val2), (op1, val1)))

            operand, (op1, val1), (op2, val2) = random.choice(operations)
            if operand == "+":
                new_value = val1 + val2
            elif operand == "-":
                new_value = val1 - val2
            elif operand == "*":
                new_value = val1 * val2
            elif operand == "/":
                new_value = int(val1 / val2)

            values.remove((op1, val1))
            values.remove((op2, val2))
            values.append((operand, new_value))
            solution.append((val1, operand, val2, new_value))

        return new_value, solution


    minimum, maximum = generate_difficulty_range(difficulty)

    while True:
        values = generate_values()
        num_operations = generate_num_operations(difficulty)
        original_values = values.copy()
        target, solution = generate_solution(values, num_operations)

        # Target cannot be one of the original values.
        if target in original_values:
            continue

        # Target cannot be done by single operator.
        acceptable_target = True
        for x, y in itertools.combinations(original_values, 2):
            if target == x + y or target == x - y or target == y - x or target == x * y or (y != 0 and target == x / y) or (x != 0 and target == y / x):
                acceptable_target = False
                break
        if not acceptable_target:
            continue

        # All puzzles must have at least some multiplication or division.
        operands = [component[1] for component in solution]
        if "*" not in operands and "/" not in operands:
            continue

        if target >= minimum and target <= maximum:
            return (list(original_values), target, solution)

def print_puzzle(difficulty, puzzle, show_solution=False):
    values, target, solution = puzzle
    puzzle_spec = {"difficulty": difficulty, "values": values, "target": target}
    if show_solution:
        solution = ", ".join([f"{num1} {op} {num2} = {result}" for (num1, op, num2, result) in solution])
        puzzle_spec["solution"] = solution
    print(json.dumps(puzzle_spec), end=",\n")

if __name__ == "__main__":
    main()
