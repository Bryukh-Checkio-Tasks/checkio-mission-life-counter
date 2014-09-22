"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

TESTS = {
    "Basics": [
        {
            "input": [((0, 1, 0, 0, 0, 0, 0), (0, 0, 1, 0, 0, 0, 0), (1, 1, 1, 0, 0, 0, 0),
                       (0, 0, 0, 0, 0, 1, 1), (0, 0, 0, 0, 0, 1, 1), (0, 0, 0, 0, 0, 0, 0),
                       (1, 1, 1, 0, 0, 0, 0)), 4],
            "answer": 15,
            "explanation": (0, 7, 0, 6),
        }
    ],
    "Extra": [
        {
            "input": [((0, 1, 0, 0, 0, 0, 0), (0, 0, 1, 0, 0, 0, 0), (1, 1, 1, 0, 0, 0, 0),
                       (0, 0, 0, 0, 0, 1, 1), (0, 0, 0, 0, 0, 1, 1), (0, 0, 0, 0, 0, 0, 0),
                       (1, 1, 1, 0, 0, 0, 0)), 4],
            "answer": 15,
            "explanation": (0, 7, 0, 6),
        }
    ]
}
